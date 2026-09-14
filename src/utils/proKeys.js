/**
 * Бизнес-логика PRO-ключей, перенос из дизайн-макета: статусы, профит,
 * попадание в инвойс, синтез строк ключей. Ключ: {id, num, user, name, note,
 * tier, proto, until, sold, off, lastVisit, gb}.
 */

import {TIER_PRICE, WARN_DAYS, INACTIVE_DAYS, BASIC_QUOTA_GB} from '@/assets/constants/proConstants';
import {daysUntil, nextBilling, parseIso, daysToBilling, monthDays, daysSinceVisit, addMonths} from '@/utils/proFormat';

export function tierPrice(tier) {
  return TIER_PRICE[tier] || 0;
}

/** Статус ключа: off / blocked (платный при billing=suspended) / idle / warn / ok. */
export function statusOf(key, billing) {
  if (key.off) return 'off';
  // Реальный бэкенд: ключ заблокирован по биллингу или из-за истёкшего срока.
  if (key.blockReason) return 'blocked';
  if (key.tier !== 'free' && billing === 'suspended') return 'blocked';
  if (!key.lastVisit) return 'idle';
  if (key.until && daysUntil(key.until) <= WARN_DAYS) return 'warn';
  return 'ok';
}

/**
 * Строка доступа ключа. Реальный режим: сохраненные при создании конфиги
 * (vless/outline из keydesk); ключи, созданные до PRO, строк не имеют — null.
 * Мок-режим: синтетика keyString.
 */
export function accessString(key, proto, format) {
  if (key.configs) {
    // «ссылка» — страница конфига VPNGen (одна на ключ), «ключ» — строка протокола.
    if (format === 'link') return key.configs.link || null;
    return key.configs[proto] || null;
  }
  return keyString(key, proto, format);
}

/** Формат по умолчанию: ссылка, если она сохранена; иначе строка протокола. */
export function defaultFormat(key) {
  if (key.configs && !key.configs.link) return 'key';
  return 'link';
}

/** Доступные протоколы ключа (null — использовать полный мок-набор). */
export function availableProtos(key) {
  if (key.configs) {
    const order = ['vless', 'outline'];
    return Object.keys(key.configs)
      .filter((p) => p !== 'link' && key.configs[p])
      .sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }
  return null;
}

/**
 * «Нет подключений 30+ дней»: ключ подключался раньше, но последний вход
 * 30+ дней назад. Ни разу не использованные (в т.ч. сегодняшние) сюда не входят.
 */
export function isInactive30(key) {
  return !key.off && Boolean(key.lastVisit) && daysSinceVisit(key.lastVisit) >= INACTIVE_DAYS;
}

/**
 * Расход за месяц (ГБ) из остатка квоты keydesk (MonthlyQuotaRemainingGB).
 * Считается только при квоте Pro Basic; остаток больше квоты (unlim, 1 ПиБ)
 * или отсутствие числа - null, «данных нет».
 */
export function usedFromRemaining(remaining) {
  if (typeof remaining !== 'number' || remaining < 0 || remaining > BASIC_QUOTA_GB) return null;
  return Math.round((BASIC_QUOTA_GB - remaining) * 10) / 10;
}

/**
 * Использованный за месяц трафик (ГБ) или null, если посчитать нельзя.
 * Ключи с бэкенда несут usedGb (число или null) - см. mapRealUser/enrichUser;
 * у мок-фикстуры поля нет, там gb - это сразу расход, как в макете.
 */
export function usedGb(key) {
  if (typeof key.usedGb === 'number') return key.usedGb;
  if (key.usedGb === null) return null;
  return key.gb || 0;
}

const TIER_ORDER = ['free', 'basic', 'unlim'];

/** Тарифы, на которые ключ можно апгрейдить (только вверх; даунгрейд пока не делаем). */
export function upgradeTiers(key) {
  const rank = TIER_ORDER.indexOf(key.tier);
  return TIER_ORDER.filter((tier, i) => tier !== 'free' && i > rank);
}

/**
 * Расчёт апгрейда (временно на фронте, до реального биллинга): неиспользованные
 * дни текущего платного месяца идут в зачёт, новый месяц начинается сегодня.
 * Период = месяц до даты окончания (все платные сроки сейчас месячные).
 * Суммы - до цента.
 */
export function upgradeQuote(key, newTier) {
  const price = tierPrice(newTier);
  const currentPrice = tierPrice(key.tier);
  const empty = {price, currentPrice, credit: 0, due: price, daysLeft: 0, periodDays: 0};
  if (!currentPrice || !key.until) return empty;

  const end = parseIso(key.until);
  const start = parseIso(addMonths(key.until, -1));
  const periodDays = Math.max(1, Math.round((end - start) / 86400000));
  const daysLeft = Math.min(periodDays, Math.max(0, daysUntil(key.until)));
  const credit = Math.min(currentPrice, Math.round(currentPrice * daysLeft / periodDays * 100) / 100);
  const due = Math.max(0, Math.round((price - credit) * 100) / 100);
  return {price, currentPrice, credit, due, daysLeft, periodDays};
}

/** Профит: продал минус себестоимость тарифа. */
export function profitOf(key) {
  return (key.sold || 0) - tierPrice(key.tier);
}

/** Войдет ли ключ в следующий инвойс. */
export function countsIn(key) {
  return key.tier !== 'free' && !key.off && Boolean(key.until) && parseIso(key.until) >= nextBilling();
}

export function paidKeys(keys) {
  return keys.filter(countsIn);
}

/** Прогноз суммы следующего инвойса. */
export function forecast(keys) {
  return paidKeys(keys).reduce((sum, k) => sum + tierPrice(k.tier), 0);
}

/** Доплата за остаток месяца при создании/апгрейде платного ключа. */
export function prorate(tier) {
  return Math.round(tierPrice(tier) * daysToBilling() / monthDays() * 100) / 100;
}

/**
 * Синтез строки доступа (ссылка/ключ) — как в макете, детерминирован от num.
 * Реальной выдачи PRO-конфигов на бэкенде пока нет.
 */
export function keyString(key, proto, format) {
  const tail = `0000${(key.num * 7919 % 65536).toString(16)}`.slice(-4);
  const isKey = format === 'key';

  if (proto === 'outline') {
    return isKey
      ? `ss://Y2hhY2hhMjA6${tail}QG5vZGUtc2V2ZXJAvpn.gen:8388#${key.user}`
      : `https://get.vpn.gen/outline/${key.user}-${tail}`;
  }
  if (proto === 'gate19') {
    return isKey
      ? `G19.${tail}.KDZhNmI3YzhkOWUw.${key.user}`
      : `gate19://${tail}@node-sever.vpn.gen:4433#${key.user}`;
  }
  return isKey
    ? `VLS.${tail}.OWY0YS00YzExLWI3ZTI.${key.user}`
    : `vless://${tail}-9f4a-4c11-b7e2-${key.user}@node-sever.vpn.gen:443?type=tcp&security=reality#${key.user}`;
}
