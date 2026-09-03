/**
 * Бизнес-логика PRO-ключей, перенос из дизайн-макета: статусы, профит,
 * попадание в инвойс, синтез строк ключей. Ключ: {id, num, user, name, note,
 * tier, proto, until, sold, off, lastVisit, gb}.
 */

import {TIER_PRICE, WARN_DAYS} from '@/assets/constants/proConstants';
import {daysUntil, nextBilling, parseIso, daysToBilling, monthDays} from '@/utils/proFormat';

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
    return key.configs[proto] || null;
  }
  return keyString(key, proto, format);
}

/** Доступные протоколы ключа (null — использовать полный мок-набор). */
export function availableProtos(key) {
  if (key.configs) {
    const order = ['vless', 'outline'];
    return Object.keys(key.configs)
      .filter((p) => key.configs[p])
      .sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }
  return null;
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
