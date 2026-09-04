/**
 * Мок-данные PRO: посевная бригада из дизайн-макета и детерминированное
 * обогащение реальных пользователей тарифами/ценами (бэкенда для этого еще
 * нет). Все даты — относительно сегодня, чтобы стенд всегда выглядел живым.
 */

import {PRO_PROTOCOLS} from '@/assets/constants/proConstants';
import {toIso, today, invoiceNumber, monthShift, formatDate} from '@/utils/proFormat';

const inDays = (d) => {
  const x = today();
  x.setDate(x.getDate() + d);
  return toIso(x);
};

const visitToday = (h, m) => {
  const x = new Date();
  x.setHours(h, m, 0, 0);
  return x.toISOString();
};

const visitDaysAgo = (d, h = 12, m = 0) => {
  const x = new Date();
  x.setDate(x.getDate() - d);
  x.setHours(h, m, 0, 0);
  return x.toISOString();
};

/** 16 ключей из макета (порядок и данные сохранены). */
export function seedKeys() {
  const soldSeed = [5, 4, 0, 0, 6, 5, 0, 10, 4, 12, 5, 0, 9, 4, 0, 10];
  const base = [
    {num: 14, name: 'Точка выдачи, ПК', note: 'Скидывает за ключ раз в два месяца.', tier: 'unlim', until: inDays(40), lastVisit: visitToday(9, 14), gb: 48.2},
    {num: 15, name: 'Второй телефон', note: '', tier: 'basic', until: inDays(3), lastVisit: visitDaysAgo(1, 22, 40), gb: 12.7},
    {num: 9, name: 'Сосед, роутер', note: 'Помогал с настройкой. На Pro переводить не просил.', tier: 'free', until: null, lastVisit: visitDaysAgo(34), gb: 3.1},
    {num: 11, name: '', note: '', tier: 'free', until: null, lastVisit: null, gb: 0},
    {num: 21, name: 'Мастерская, ноутбук', note: '', tier: 'basic', until: inDays(58), lastVisit: visitDaysAgo(6), gb: 96.4},
    {num: 24, name: 'Рабочий телефон', note: 'Не выключать до декабря.', tier: 'basic', until: inDays(90), lastVisit: visitToday(8, 2), gb: 7.4},
    {num: 25, name: 'Дача, роутер', note: '', tier: 'free', until: null, lastVisit: visitDaysAgo(31), gb: 61},
    {num: 7, name: 'Старый планшет', note: 'Сломался в июне, включать не нужно.', tier: 'unlim', until: inDays(-54), lastVisit: visitDaysAgo(55), gb: 210.8, off: true},
    {num: 28, name: 'Кухня, планшет', note: '', tier: 'basic', until: inDays(6), lastVisit: visitDaysAgo(8), gb: 19.2},
    {num: 29, name: 'Мастерская, ПК', note: 'Общий компьютер, ключ знают трое.', tier: 'unlim', until: inDays(127), lastVisit: visitDaysAgo(1, 19, 11), gb: 88.6},
    {num: 30, name: 'Курьерский планшет', note: '', tier: 'basic', until: inDays(52), lastVisit: visitToday(7, 45), gb: 4.8},
    {num: 31, name: '', note: 'Запасной, никому не выдан.', tier: 'free', until: null, lastVisit: null, gb: 0},
    {num: 33, name: 'Ноутбук в поездках', note: '', tier: 'unlim', until: inDays(163), lastVisit: visitToday(10, 5), gb: 72.5},
    {num: 34, name: 'Склад, касса', note: '', tier: 'basic', until: inDays(117), lastVisit: visitDaysAgo(1, 9, 48), gb: 1.6},
    {num: 35, name: 'Родители, планшет', note: 'Не трогать, настроено один раз.', tier: 'free', until: null, lastVisit: visitDaysAgo(35), gb: 15.4},
    {num: 36, name: 'Библиотека, ПК', note: '', tier: 'unlim', until: inDays(202), lastVisit: visitToday(12, 11), gb: 104.2},
  ];

  return base.map((k, i) => ({
    id: `seed-${k.num}`,
    user: `user-0${k.num < 10 ? `0${k.num}` : k.num}`,
    proto: PRO_PROTOCOLS[i % 3],
    sold: k.tier === 'free' ? 0 : soldSeed[i] || 0,
    off: Boolean(k.off),
    ...k,
  }));
}

/** 3 прошлых инвойса из макета. */
export function seedInvoices() {
  const sums = [26, 17, 7];
  const keysN = [7, 5, 2];

  return [1, 2, 3].map((i) => {
    const first = monthShift(-i);
    return {
      num: invoiceNumber(-i),
      periodOffset: -i,
      created: formatDate(first),
      paidAt: formatDate(new Date(first.getFullYear(), first.getMonth(), i === 2 ? 2 : 1)),
      keys: keysN[i - 1],
      sum: sums[i - 1],
      status: 'paid',
    };
  });
}

/** История выручки (€ за 5 прошлых месяцев; текущий добавляется из ключей). */
export const REVENUE_HISTORY = [18, 24, 29, 38, 47];

/** Фадж «выручки за всё время» из макета. */
export const ALL_TIME_EXTRA = 96;

const hashString = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0; // eslint-disable-line no-bitwise
  }
  return h;
};

/**
 * Детерминированное мок-обогащение реального пользователя (GET /user):
 * тариф, срок, «продал за», протокол — стабильны между перезагрузками.
 */
export function enrichUser(user, index) {
  const h = hashString(String(user.UserID || index));
  const tier = ['free', 'basic', 'basic', 'unlim'][h % 4];
  const soldOptions = [0, 4, 5, 6, 9, 10, 12];

  return {
    id: String(user.UserID),
    num: (h % 89) + 10,
    user: `user-${String((h % 899) + 100)}`,
    name: user.UserName || '',
    note: '',
    tier,
    proto: PRO_PROTOCOLS[h % 3],
    until: tier === 'free' ? null : inDays((h % 190) + 10),
    sold: tier === 'free' ? 0 : soldOptions[h % soldOptions.length],
    off: false,
    lastVisit: user.LastVisitHour || null,
    gb: user.MonthlyQuotaRemainingGB ?? 0,
  };
}
