/**
 * Сервисный слой PRO. Работает в двух режимах:
 *
 * - РЕАЛЬНЫЙ (JWT принес claim `pro`): ключи и их PRO-атрибуты (тариф, срок,
 *   название, комментарий, «продал за») живут в keydesk —
 *   GET /user, PATCH /user/:id/pro, POST /user/:id/tier, POST /user/:id/extend,
 *   PATCH /user/:id/block|unblock, POST/DELETE /user.
 * - МОК (dev/stage с ?pro=true без claim): прежнее детерминированное
 *   обогащение поверх GET /user либо посевная бригада из макета; мутации
 *   персистятся в localStorage.
 *
 * Биллинг/инвойсы/денежная история — всегда мок до появления биллинга.
 *
 * Дев-ручки (только dev/stage): ?proBilling=issued|overdue|suspended —
 * состояние подписки, ?proEmpty=true — пустая бригада (только мок-режим).
 */

import axios from 'axios';
import {apiLink, isDevOrStageHost} from '@/const/api';
import {useAuthStore} from '@/store/auth';
import {useProfileStore} from '@/store/profile';
import {safeGetItem, safeSetItem} from '@/utils/safeStorage';
import {seedKeys, seedInvoices, enrichUser, REVENUE_HISTORY, ALL_TIME_EXTRA} from '@/api/proMockData';

const OVERRIDES_KEY = 'proMockOverrides';

const MOCK_BRIGADE_NAME = 'Северный узел';

function isRealPro() {
  return useProfileStore().isPRO === true;
}

function readOverrides() {
  try {
    return JSON.parse(safeGetItem(OVERRIDES_KEY)) || {};
  } catch {
    return {};
  }
}

function writeOverrides(overrides) {
  safeSetItem(OVERRIDES_KEY, JSON.stringify(overrides));
}

function devQuery(name) {
  if (!isDevOrStageHost) return null;
  return new URLSearchParams(window.location.search).get(name);
}

const withAuthRetry = async (request) => {
  const authStore = useAuthStore();
  await authStore.fetchToken();

  try {
    return await request();
  } catch (error) {
    if (error.response?.status === 401) {
      await authStore.fetchToken({force: true});
      return request();
    }
    throw error;
  }
};

function applyOverrides(keys) {
  const overrides = readOverrides();
  const byId = overrides.keys || {};
  const created = overrides.created || [];

  return keys
    .map((k) => (byId[k.id] ? {...k, ...byId[k.id]} : k))
    .concat(created.map((k) => (byId[k.id] ? {...k, ...byId[k.id]} : k)))
    .filter((k) => !k.deleted);
}

const hashString = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0; // eslint-disable-line no-bitwise
  }
  return h;
};

/** Реальный пользователь keydesk → PRO-ключ (поля бэкенда, ничего мокового). */
function mapRealUser(user) {
  return {
    id: String(user.UserID),
    // num нужен только для синтеза строки доступа — детерминирован от id.
    num: (hashString(String(user.UserID)) % 899) + 100,
    user: user.UserName || '',
    name: user.ProLabel || '',
    note: user.ProNote || '',
    tier: user.Tier || 'free',
    proto: 'vless',
    until: user.PaidUntil ? String(user.PaidUntil).slice(0, 10) : null,
    sold: (user.SoldForCents || 0) / 100,
    off: Boolean(user.Blocked) && !user.ProBlockReason,
    blockReason: user.ProBlockReason || null,
    lastVisit: user.LastVisitHour || null,
    gb: user.MonthlyQuotaRemainingGB ?? 0,
  };
}

async function fetchUsers() {
  const r = await withAuthRetry(() => axios.get(`${apiLink}/user`));
  return Array.isArray(r.data) ? r.data : [];
}

/** GET /user + маппинг. Возвращает {brigadierName, brigadeName?, keys}. */
export async function fetchProKeys() {
  if (isRealPro()) {
    const users = await fetchUsers();
    const [brigadier, ...rest] = users;
    return {
      brigadierName: brigadier?.UserName || '',
      keys: rest.map(mapRealUser),
    };
  }

  if (devQuery('proEmpty') === 'true') {
    return {brigadierName: '', keys: applyOverrides([])};
  }

  try {
    const users = await fetchUsers();
    if (!users.length) throw new Error('empty users');

    const [brigadier, ...rest] = users;
    const source = rest.length ? rest : users;
    return {
      brigadierName: brigadier?.UserName || '',
      keys: applyOverrides(source.map(enrichUser)),
    };
  } catch {
    // Нет бэкенда (чистый мок-стенд) — посевная бригада из макета.
    return {brigadierName: 'Единственный Вильчек', brigadeName: MOCK_BRIGADE_NAME, keys: applyOverrides(seedKeys())};
  }
}

/** Название / комментарий / «продал за». */
export async function patchProKeyMeta(id, {name, note, sold}) {
  if (isRealPro()) {
    const body = {};
    if (name !== undefined) body.Label = name;
    if (note !== undefined) body.Note = note;
    if (sold !== undefined) body.SoldForCents = Math.round(sold * 100);
    await withAuthRetry(() => axios.patch(`${apiLink}/user/${id}/pro`, body));
    return;
  }

  const fields = {};
  if (name !== undefined) fields.name = name;
  if (note !== undefined) fields.note = note;
  if (sold !== undefined) fields.sold = sold;
  mockPatch(id, fields);
}

/** Смена тарифа (апгрейд/даунгрейд). Возвращает новую дату окончания (ISO|null). */
export async function setProKeyTier(id, tier, months) {
  if (isRealPro()) {
    const r = await withAuthRetry(() => axios.post(`${apiLink}/user/${id}/tier`, {Tier: tier, Months: months}));
    return r.data?.PaidUntil ? String(r.data.PaidUntil).slice(0, 10) : null;
  }

  const {addMonths} = await import('@/utils/proFormat');
  const until = tier === 'free' ? null : addMonths(null, months);
  mockPatch(id, {tier, until});
  return until;
}

/** Продление платного ключа. Возвращает новую дату окончания. */
export async function extendProKey(id, months, currentUntil) {
  if (isRealPro()) {
    const r = await withAuthRetry(() => axios.post(`${apiLink}/user/${id}/extend`, {Months: months}));
    return r.data?.PaidUntil ? String(r.data.PaidUntil).slice(0, 10) : null;
  }

  const {addMonths} = await import('@/utils/proFormat');
  const until = addMonths(currentUntil, months);
  mockPatch(id, {until});
  return until;
}

/** Деактивация/включение ключа — штатные block/unblock keydesk. */
export async function setProKeyOff(id, off) {
  if (isRealPro()) {
    await withAuthRetry(() => axios.patch(`${apiLink}/user/${id}/${off ? 'block' : 'unblock'}`));
    return;
  }

  mockPatch(id, off ? {off: true} : {off: false, lastVisit: new Date().toISOString()});
}

/**
 * Создание ключа. В реальном режиме: POST /user, затем тариф и атрибуты.
 * Возвращает созданный ключ.
 */
export async function createProKey(payload, localKey) {
  if (isRealPro()) {
    const r = await withAuthRetry(() => axios.post(`${apiLink}/user`, null, {headers: {accept: 'application/json'}}));
    const created = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
    const id = String(created.UserID);

    if (payload.tier !== 'free') {
      await setProKeyTier(id, payload.tier, payload.months);
    }
    if (payload.name || payload.note || payload.sold) {
      await patchProKeyMeta(id, {name: payload.name, note: payload.note, sold: payload.sold});
    }

    const users = await fetchUsers();
    const fresh = users.find((u) => String(u.UserID) === id);
    return fresh ? mapRealUser(fresh) : null;
  }

  const overrides = readOverrides();
  overrides.created = (overrides.created || []).concat([localKey]);
  writeOverrides(overrides);
  return localKey;
}

export async function deleteProKey(id) {
  if (isRealPro()) {
    await withAuthRetry(() => axios.delete(`${apiLink}/user/${id}`));
    return;
  }

  mockPatch(id, {deleted: true});
}

function mockPatch(id, fields) {
  const overrides = readOverrides();
  overrides.keys = overrides.keys || {};
  overrides.keys[id] = {...overrides.keys[id], ...fields};
  writeOverrides(overrides);
}

// ——— Биллинг: реальные локальные инвойсы keydesk либо мок. ———

/** GET /pro/billing (реальный режим) либо мок-состояние. */
export async function fetchProBilling() {
  if (isRealPro()) {
    const r = await withAuthRetry(() => axios.get(`${apiLink}/pro/billing`));
    const current = r.data?.InvoiceID
      ? {
        num: r.data.InvoiceID,
        issuedAt: r.data.IssuedAt || null,
        dueAt: r.data.DueAt || null,
        suspendAt: r.data.SuspendAt || null,
        sum: (r.data.TotalCents || 0) / 100,
      }
      : null;
    return {status: r.data?.State || 'paid', current, real: true};
  }

  const forced = devQuery('proBilling');
  if (forced && ['paid', 'issued', 'overdue', 'suspended'].includes(forced)) {
    return {status: forced};
  }
  return {status: readOverrides().billing || 'paid'};
}

/** GET /pro/invoices (реальный режим) либо посевные инвойсы макета. */
export async function fetchProInvoices() {
  if (isRealPro()) {
    const r = await withAuthRetry(() => axios.get(`${apiLink}/pro/invoices`));
    const list = Array.isArray(r.data) ? r.data : [];
    return list.map((i) => ({
      num: i.ID,
      periodId: i.ID,
      createdAt: i.CreatedAt || null,
      paidAtIso: i.PaidAt || null,
      keys: i.KeysCount || 0,
      sum: (i.TotalCents || 0) / 100,
      status: i.Status === 'issued' ? 'awaiting' : i.Status,
      real: true,
    }));
  }

  return seedInvoices();
}

/** Будущий эндпоинт: GET /pro/analytics. Пользовательские счетчики можно
 *  подпитать из реального GET /users/stats; денежная история — мок. */
export async function fetchProAnalytics() {
  let stats = null;
  try {
    const r = await withAuthRetry(() => axios.get(`${apiLink}/users/stats`));
    stats = r.data;
  } catch {
    stats = null;
  }
  return {revenueHistory: REVENUE_HISTORY, allTimeExtra: ALL_TIME_EXTRA, stats};
}

/** POST /pro/invoices/current/pay (реальный режим, стаб-оплата) либо мок. */
export async function payProInvoice() {
  if (isRealPro()) {
    const r = await withAuthRetry(() => axios.post(`${apiLink}/pro/invoices/current/pay`));
    return {status: r.data?.State || 'paid'};
  }

  const overrides = readOverrides();
  overrides.billing = 'paid';
  writeOverrides(overrides);
  return {status: 'paid'};
}
