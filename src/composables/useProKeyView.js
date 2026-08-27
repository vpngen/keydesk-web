import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useProBillingStore} from '@/store/proBilling';
import {statusOf, profitOf, countsIn, tierPrice} from '@/utils/proKeys';
import {money, formatIso, formatShort, nextBilling, daysUntil, lastVisitParts, formatGb} from '@/utils/proFormat';

/**
 * Вью-модель одного PRO-ключа (общая для карточки и строки таблицы):
 * статус, подписи, суммы. Цветовые ветки макета живут в SCSS-модификаторах.
 */
export function useProKeyView(keyRef) {
  const {t} = useI18n();
  const billingStore = useProBillingStore();
  const {status: billingStatus} = storeToRefs(billingStore);

  const status = computed(() => statusOf(keyRef.value, billingStatus.value));
  const isFree = computed(() => keyRef.value.tier === 'free');
  const isDead = computed(() => status.value === 'off');
  const isBlocked = computed(() => status.value === 'blocked');
  const isWarn = computed(() => status.value === 'warn');

  const hasName = computed(() => Boolean(keyRef.value.name && keyRef.value.name.trim()));
  const hasNote = computed(() => Boolean(keyRef.value.note && keyRef.value.note.trim()));
  const displayName = computed(() => (hasName.value ? keyRef.value.name : t('pro.card.unnamed')));

  const statusWord = computed(() => t(`pro.status.${status.value}`));
  const tariffLabel = computed(() => t(`pro.tiers.${keyRef.value.tier}.name`));

  const untilText = computed(() => formatIso(keyRef.value.until) || t('pro.card.termless'));

  const lastLabel = computed(() => {
    const parts = lastVisitParts(keyRef.value.lastVisit);
    if (!parts.key) return '—';
    if (parts.key === 'date') return parts.date;
    return `${t(`pro.card.${parts.key}`)}, ${parts.time}`;
  });

  const gbText = computed(() => `${formatGb(keyRef.value.gb)} ${t('pro.card.gb')}`);

  const billable = computed(() => countsIn(keyRef.value));
  const profit = computed(() => profitOf(keyRef.value));

  const profitText = computed(() => {
    if (isFree.value && !keyRef.value.sold) return '—';
    return `${profit.value > 0 ? '+' : ''}${money(profit.value)}`;
  });

  const profitTone = computed(() => {
    if (profit.value > 0) return 'pos';
    if (profit.value < 0) return 'neg';
    return 'zero';
  });

  const soldText = computed(() => {
    if (isFree.value && !keyRef.value.sold) return '—';
    return keyRef.value.sold
      ? `${money(keyRef.value.sold)}${t('pro.card.perMonth')}`
      : t('pro.card.notSold');
  });

  const invoiceLabel = computed(() => (isDead.value
    ? t('pro.card.nextInvoice')
    : t('pro.card.inInvoice', {date: formatShort(nextBilling())})));

  const invoiceValue = computed(() => (billable.value
    ? `${money(tierPrice(keyRef.value.tier))}${t('pro.card.perMonth')}`
    : t('pro.card.wontEnter')));

  const untilLabel = computed(() => {
    if (isDead.value) return t('pro.card.disabled');
    if (isWarn.value) return t('pro.card.expiresIn', {days: daysUntil(keyRef.value.until)});
    return t('pro.card.validUntil');
  });

  return {
    status,
    isFree,
    isDead,
    isBlocked,
    isWarn,
    hasName,
    hasNote,
    displayName,
    statusWord,
    tariffLabel,
    untilText,
    untilLabel,
    lastLabel,
    gbText,
    billable,
    profit,
    profitText,
    profitTone,
    soldText,
    invoiceLabel,
    invoiceValue,
  };
}
