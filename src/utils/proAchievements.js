/**
 * Ачивки PRO и реакции кабанчика в аналитике: чистая логика без состояния.
 * Спека: Confluence «Ачивки в ключницу / Key Desk achievements» (Наташа, 2026-11-19).
 *
 * Деньги считаются по экономике расчётного цикла из GET /pro/analytics:
 * доход = учтённые цены продажи активных платных ключей, стоимость PRO =
 * подписка (пока 0, фиксированной платы в продукте нет) + стоимость тарифов
 * платных ключей. «Бригада вышла в плюс» имеет смысл только при подписке > 0,
 * иначе совпадает с «PRO окупился» и не показывается.
 */

import {PRO_SUBSCRIPTION_PRICE} from '@/assets/constants/proConstants';
import {isDevOrStageHost} from '@/const/api';

export const ACHIEVEMENT_IDS = [
  'pro_start',
  'first_paid_key',
  'first_income',
  'half_paid_off',
  'paid_off',
  'in_profit',
  'keys_5',
  'keys_10',
];

export const REACTION_IDS = ['trend_up', 'trend_down', 'not_paid_off'];

export const KEY_MILESTONES = {keys_5: 5, keys_10: 10};

/**
 * Дев-ручки (только dev/stage): ?proAch=reset | <id ачивки для превью>,
 * ?proReaction=<id реакции>, ?proSubscription=<евро в месяц>.
 */
export function devKnob(name) {
  if (!isDevOrStageHost) return null;
  return new URLSearchParams(window.location.search).get(name);
}

/** Цена PRO-подписки за цикл, евро. */
export function subscriptionPrice() {
  const override = Number(devKnob('proSubscription'));
  return Number.isFinite(override) && override > 0 ? override : PRO_SUBSCRIPTION_PRICE;
}

/** Выпущенный платный ключ: любой тариф кроме free, независимо от статуса. */
export function isPaidKey(key) {
  return key.tier !== 'free';
}

/** Ключ с учтённым доходом («продал за» > 0). */
export function hasIncome(key) {
  return (key.sold || 0) > 0;
}

/** Экономика цикла: доход, стоимость PRO, прибыль (евро). */
export function economicsOf(analytics, subscription = subscriptionPrice()) {
  const e = analytics?.economics || {};
  const income = e.expectedRevenue || 0;
  const keyCost = e.forecastKeyCost || 0;
  const cost = subscription + keyCost;
  return {income, keyCost, subscription, cost, profit: income - cost};
}

/** Денежные ачивки, условия которых выполнены при такой картине. */
export function moneyAchievements(econ) {
  const ids = [];
  if (econ.cost > 0 && econ.income >= econ.cost / 2 && econ.income < econ.cost) ids.push('half_paid_off');
  if (econ.cost > 0 && econ.income >= econ.cost) ids.push('paid_off');
  if (econ.subscription > 0 && econ.profit > 0) ids.push('in_profit');
  return ids;
}

/** Ачивки по ключам, условия которых выполнены для такого списка. */
export function keyAchievements(keys) {
  const paid = keys.filter(isPaidKey).length;
  const ids = [];
  if (paid >= 1) ids.push('first_paid_key');
  if (keys.some(hasIncome)) ids.push('first_income');
  Object.entries(KEY_MILESTONES).forEach(([id, n]) => {
    if (paid >= n) ids.push(id);
  });
  return ids;
}

/**
 * Реакция кабанчика на аналитику. Приоритет: падение, рост, «пока в минусе».
 * Падение - платных ключей стало меньше, чем в прошлом месяце; рост - их стало
 * больше или доход цикла выше прошлого месяца.
 */
export function reactionFor(analytics, subscription = subscriptionPrice()) {
  if (!analytics) return null;
  const net = analytics.paidUsers?.net || 0;
  const months = analytics.months || [];
  const last = months[months.length - 1];
  const prev = months[months.length - 2];
  const incomeGrew = Boolean(last && prev && last.available && prev.available && last.expected > prev.expected);
  if (net < 0) return 'trend_down';
  if (net > 0 || incomeGrew) return 'trend_up';
  const econ = economicsOf(analytics, subscription);
  if (econ.income > 0 && econ.income < econ.cost) return 'not_paid_off';
  return null;
}
