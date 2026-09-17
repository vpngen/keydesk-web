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
import {usedFromRemaining} from '@/utils/proKeys';
import {TIER_PRICE} from '@/assets/constants/proConstants';
import {apiLink, isDevOrStageHost} from '@/const/api';
import {useAuthStore} from '@/store/auth';
import {useProfileStore} from '@/store/profile';
import {safeGetItem, safeSetItem} from '@/utils/safeStorage';
import {seedKeys, seedInvoices, enrichUser} from '@/api/proMockData';
import {buildMockAnalytics} from '@/api/proMockAnalytics';

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
    // {} (не null!) у ключей без сохраненных строк: реальный режим никогда
    // не должен падать в мок-синтезатор — иначе скопируют нерабочий ключ.
    configs: user.ProConfigs || {},
    proto: user.ProConfigs?.vless ? 'vless' : user.ProConfigs?.outline ? 'outline' : 'vless',
    until: user.PaidUntil ? String(user.PaidUntil).slice(0, 10) : null,
    sold: (user.SoldForCents || 0) / 100,
    off: Boolean(user.Blocked) && !user.ProBlockReason,
    blockReason: user.ProBlockReason || null,
    lastVisit: user.LastVisitHour || null,
    gb: user.MonthlyQuotaRemainingGB ?? 0,
    // Расход считаем из остатка квоты; для unlim/без данных - null.
    usedGb: usedFromRemaining(user.MonthlyQuotaRemainingGB),
    createdAt: user.CreatedAt || null,
  };
}

async function fetchUsers() {
  const r = await withAuthRetry(() => axios.get(`${apiLink}/user`));
  return Array.isArray(r.data) ? r.data : [];
}

/** Актуальное состояние одного ключа (после смены тарифа/продления). Мок: null. */
export async function fetchProKey(id) {
  if (!isRealPro()) return null;
  const users = await fetchUsers();
  const fresh = users.find((u) => String(u.UserID) === String(id));
  return fresh ? mapRealUser(fresh) : null;
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
export async function setProKeyTier(id, tier, months, chargedCents = null) {
  if (isRealPro()) {
    // ChargedCents - что списал платёжный шаг; бэкенд пишет это в PRO-леджер.
    const body = {Tier: tier, Months: months};
    if (chargedCents !== null) body.ChargedCents = chargedCents;
    const r = await withAuthRetry(() => axios.post(`${apiLink}/user/${id}/tier`, body));
    return r.data?.PaidUntil ? String(r.data.PaidUntil).slice(0, 10) : null;
  }

  const {addMonths} = await import('@/utils/proFormat');
  const until = tier === 'free' ? null : addMonths(null, months);
  mockPatch(id, {tier, until});
  return until;
}


/** Деактивация/включение ключа — штатные block/unblock keydesk. */
export async function setProKeyOff(id, off) {
  if (isRealPro()) {
    await withAuthRetry(() => axios.patch(`${apiLink}/user/${id}/${off ? 'block' : 'unblock'}`));
    return;
  }

  // Включение только разрешает ключ: «последний вход» ставят реальные подключения.
  mockPatch(id, {off});
}

/**
 * Создание ключа. В реальном режиме: POST /user, затем тариф и атрибуты.
 * Возвращает созданный ключ.
 */
export async function createProKey(payload, localKey, charged = true) {
  if (isRealPro()) {
    const r = await withAuthRetry(() => axios.post(`${apiLink}/user`, null, {headers: {accept: 'application/json'}}));
    const created = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
    const id = String(created.UserID);

    if (payload.tier !== 'free') {
      await setProKeyTier(id, payload.tier, payload.months, charged ? Math.round((TIER_PRICE[payload.tier] || 0) * 100) : null);
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

/**
 * Списание за платный ключ с привязанной карты (карта привязывается при
 * покупке PRO-бригады, задолго до Ключницы). Платежной интеграции пока нет —
 * заглушка: успех после короткой паузы; реальный вызов появится как
 * POST /pro/charge. Дев-ручка (dev/stage): ?proPayFail=true — отказ оплаты.
 */
export async function chargeProKey({tier, amount = null}) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (devQuery('proPayFail') === 'true') {
    const error = new Error('payment failed');
    error.code = 'payment_failed';
    throw error;
  }
  // amount: сумма к списанию в евро (null = полная цена тарифа) - для будущего
  // реального вызова; стаб её только возвращает.
  return {status: 'charged', tier, amount: amount ?? TIER_PRICE[tier] ?? 0};
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
const mapInvoiceLine = (l) => ({
  tier: l.Tier,
  qty: l.Qty || 0,
  days: l.Days || 0,
  price: (l.PriceCents || 0) / 100,
  sum: (l.AmountCents || 0) / 100,
});

/**
 * GET /pro/billing: состояние, скользящий цикл бригады (якорь - дата
 * подключения PRO), предварительный расчёт следующего инвойса. В цикле 0
 * платные ключи списываются сразу (immediateCharges), дальше - по инвойсу.
 */
export async function fetchProBilling() {
  if (isRealPro()) {
    const r = await withAuthRetry(() => axios.get(`${apiLink}/pro/billing`));
    const b = r.data || {};
    const current = b.InvoiceID
      ? {
        num: b.InvoiceID,
        issuedAt: b.IssuedAt || null,
        dueAt: b.DueAt || null,
        sum: (b.TotalCents || 0) / 100,
      }
      : null;
    return {
      status: b.State || 'paid',
      current,
      real: true,
      since: b.ProSince || null,
      cycleIndex: b.CycleIndex || 0,
      cycleStart: b.CycleStart || null,
      cycleEnd: b.CycleEnd || null,
      // Бэкенд опускает false (omitempty): при известном цикле отсутствие поля = false.
      immediateCharges: b.ProSince ? b.ImmediateCharges === true : true,
      nextInvoiceAt: b.NextInvoiceAt || null,
      estimate: {
        sum: (b.EstimateCents || 0) / 100,
        keys: b.EstimateKeys || 0,
        lines: (b.EstimateLines || []).map(mapInvoiceLine),
      },
    };
  }

  const forced = devQuery('proBilling');
  const status = forced && ['paid', 'issued', 'overdue'].includes(forced) ? forced : (readOverrides().billing || 'paid');
  return {status, immediateCharges: true, estimate: null, nextInvoiceAt: null};
}

/** GET /pro/invoices (реальный режим) либо посевные инвойсы макета. */
export async function fetchProInvoices() {
  if (isRealPro()) {
    const r = await withAuthRetry(() => axios.get(`${apiLink}/pro/invoices`));
    const list = Array.isArray(r.data) ? r.data : [];
    return list.map((i) => ({
      num: i.ID,
      periodId: i.ID,
      periodFrom: i.PeriodFrom || null,
      periodTo: i.PeriodTo || null,
      createdAt: i.CreatedAt || null,
      dueAt: i.DueAt || null,
      paidAtIso: i.PaidAt || null,
      keys: i.KeysCount || 0,
      sum: (i.TotalCents || 0) / 100,
      lines: (i.Lines || []).map(mapInvoiceLine),
      status: i.Status === 'issued' ? 'awaiting' : i.Status,
      real: true,
    }));
  }

  return seedInvoices();
}

const cents = (v) => (v || 0) / 100;

const mapTierGroup = (g) => ({
  count: g?.Count || 0,
  priced: g?.Priced || 0,
  share: g?.SharePct || 0,
  avgPrice: cents(g?.AverageSellingCents),
});

const mapRecommendation = (r) => ({count: r?.Count || 0, ids: r?.IDs || []});

/**
 * GET /pro/analytics: бизнес-метрики считает бэкенд (леджер + текущее
 * состояние ключей) - фронт ничего не суммирует по массиву ключей.
 * Мок-стенд: приближение по ключам (см. proMockAnalytics).
 */
export async function fetchProAnalytics(keys = []) {
  if (!isRealPro()) return buildMockAnalytics(keys);
  const r = await withAuthRetry(() => axios.get(`${apiLink}/pro/analytics`));
  const a = r.data || {};
  const paid = a.PaidUsers || {};
  const renewals = a.Renewals || {};
  const recs = a.Recommendations || {};
  const thresholds = a.Thresholds || {};
  return {
    period: {
      start: a.Period?.Start || null,
      end: a.Period?.End || null,
      index: a.Period?.Index || 0,
    },
    economics: {
      expectedRevenue: cents(a.Economics?.ExpectedRevenueCents),
      forecastKeyCost: cents(a.Economics?.ForecastKeyCostCents),
      forecastProfit: cents(a.Economics?.ForecastProfitCents),
    },
    paidUsers: {
      active: paid.Active || 0,
      newCount: paid.New || 0,
      stopped: paid.StoppedPaying || 0,
      net: paid.NetGrowth || 0,
      priced: paid.Priced || 0,
      basic: mapTierGroup(paid.Basic),
      unlim: mapTierGroup(paid.Unlim),
    },
    renewals: {
      status: renewals.Status || 'no_data',
      eligible: renewals.Eligible || 0,
      renewed: renewals.Renewed || 0,
      rate: renewals.RatePct || 0,
      changePp: typeof renewals.ChangePp === 'number' ? renewals.ChangePp : null,
      good: renewals.Good === true,
    },
    recommendations: {
      notRenewed: mapRecommendation(recs.NotRenewed),
      basicHighUsage: mapRecommendation(recs.BasicHighUsage),
      basicAtLimit: mapRecommendation(recs.BasicAtLimit),
      inactivePaid: mapRecommendation(recs.InactivePaid),
    },
    thresholds: {
      basicHighUsagePct: thresholds.BasicHighUsagePct || 80,
      inactiveDays: thresholds.InactiveDays || 14,
      goodRenewalPct: thresholds.GoodRenewalPct || 75,
    },
    months: (a.Months || []).map((m) => ({
      month: m.Month,
      available: m.Available === true,
      reconstructed: m.Reconstructed === true,
      expected: cents(m.ExpectedCents),
      cost: cents(m.CostCents),
      profit: cents(m.ProfitCents),
    })),
  };
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
