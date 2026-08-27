/**
 * Форматирование дат и денег PRO-интерфейса. Логика перенесена из дизайн-макета
 * (keydesk-pro-web) 1:1: DD.MM.YYYY, € с округлением до цента, месячный биллинг
 * с 1-го числа.
 */

const z = (n) => (n < 10 ? `0${n}` : `${n}`);

export function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function parseIso(iso) {
  const p = String(iso).split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
}

export function toIso(d) {
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

/** DD.MM.YYYY из Date. */
export function formatDate(d) {
  return `${z(d.getDate())}.${z(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/** DD.MM.YYYY из ISO-строки; null/undefined → null (бессрочно, подпись — на i18n). */
export function formatIso(iso) {
  return iso ? formatDate(parseIso(iso)) : null;
}

/** DD.MM из Date. */
export function formatShort(d) {
  return `${z(d.getDate())}.${z(d.getMonth() + 1)}`;
}

/** Первое число месяца со сдвигом offset от текущего. */
export function monthShift(offset) {
  const t = today();
  return new Date(t.getFullYear(), t.getMonth() + offset, 1);
}

/** Номер инвойса вида YYYY-MM. */
export function invoiceNumber(offset) {
  const d = monthShift(offset);
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}`;
}

export function shiftDays(n) {
  const d = today();
  d.setDate(d.getDate() + n);
  return d;
}

/** ISO + m месяцев (null → от сегодня). */
export function addMonths(iso, m) {
  const d = iso ? parseIso(iso) : today();
  d.setMonth(d.getMonth() + m);
  return toIso(d);
}

/** Дней от сегодня до ISO-даты (может быть отрицательным). */
export function daysUntil(iso) {
  return Math.round((parseIso(iso) - today()) / 86400000);
}

/** Дата следующего биллинга — 1-е число следующего месяца. */
export function nextBilling() {
  return monthShift(1);
}

export function daysToBilling() {
  return Math.round((nextBilling() - today()) / 86400000);
}

export function monthDays() {
  const t = today();
  return new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
}

/** €-сумма: целые без хвоста, дробные с двумя знаками. */
export function money(n) {
  const v = Math.round(n * 100) / 100;
  const s = v % 1 === 0 ? String(v) : v.toFixed(2);
  return `€${s}`;
}

/** Трафик в ГБ с запятой-разделителем (как в макете: 48,2). */
export function formatGb(gb) {
  return String(gb ?? 0).replace('.', ',');
}

/**
 * Подпись последнего входа. Возвращает {key, time, date}:
 * key 'today'/'yesterday' — компонент подставляет t(`pro.card.${key}`) + time,
 * key 'date' — готовая дата, key null — входа не было («—»).
 */
export function lastVisitParts(iso) {
  if (!iso) return {key: null};
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return {key: null};

  const t = today();
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((t - day) / 86400000);
  const time = `${z(d.getHours())}:${z(d.getMinutes())}`;

  if (diff === 0) return {key: 'today', time};
  if (diff === 1) return {key: 'yesterday', time};
  return {key: 'date', date: formatDate(day)};
}

/** Дней с последнего входа (999 — не заходил, как в макете). */
export function daysSinceVisit(iso) {
  if (!iso) return 999;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 999;
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.max(0, Math.round((today() - day) / 86400000));
}
