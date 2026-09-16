<template>
  <ProDialog
    :max-width="660"
    :primary-label="`${t('pro.dialogs.pay.submit')} ${sumText}`"
    :title="t('pro.dialogs.pay.title', {num: invoiceNum})"
    primary-variant="red"
    @close="emit('close')"
    @primary="emit('pay')"
  >
    <div class="pro-dialog__body">
      <div class="pro-pay__head">
        <div class="pro-pay__head-main">
          <div class="pro-pay__head-label">{{ t('pro.dialogs.pay.invoiceLabel', {num: invoiceNum}) }}</div>
          <div class="pro-pay__head-sum">{{ sumText }}</div>
        </div>
        <div class="pro-pay__head-sub">{{ t('pro.dialogs.pay.period', {from: periodFrom, to: periodTo}) }}<br>{{ t('pro.dialogs.pay.due', {date: dueDate}) }}</div>
      </div>
      <div class="pro-pay__lines">
        <div v-for="line in payLines" :key="line.name" class="pro-pay__line">
          <div class="pro-pay__line-name">{{ line.name }}</div>
          <div class="pro-pay__line-qty">{{ line.qty }}</div>
          <div class="pro-pay__line-price">{{ line.price }}</div>
          <div class="pro-pay__line-sum">{{ line.sum }}</div>
        </div>
        <div class="pro-pay__total">
          <div class="pro-pay__total-label">{{ t('pro.dialogs.pay.total') }}</div>
          <div class="pro-pay__total-sum">{{ sumText }}</div>
        </div>
      </div>
      <div class="pro-dialog__info">{{ t('pro.dialogs.pay.noteDefault') }}</div>
    </div>
  </ProDialog>
</template>

<script setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import ProDialog from '@/components/pro/dialogs/ProDialog.vue';
import {useProKeysStore} from '@/store/proKeys';
import {useProBillingStore} from '@/store/proBilling';
import {tierPrice} from '@/utils/proKeys';
import {money, invoiceNumber, monthShift, formatShort, formatDate, shiftDays, today} from '@/utils/proFormat';

const emit = defineEmits(['close', 'pay']);

const {t} = useI18n();
const proKeysStore = useProKeysStore();
const billingStore = useProBillingStore();
const {paidList, forecastSum} = storeToRefs(proKeysStore);
const {currentInvoice, invoices} = storeToRefs(billingStore);

// Реальный инвойс текущего цикла (с составом по дням); мок - прогноз по ключам.
const invoice = computed(() => invoices.value.find((i) => i.num === currentInvoice.value?.num) || null);
const fmt = (iso) => (iso ? formatDate(new Date(iso)) : '—');

const invoiceNum = computed(() => currentInvoice.value?.num || invoiceNumber(0));
const sumText = computed(() => money(currentInvoice.value?.sum ?? forecastSum.value));
const periodFrom = computed(() => (invoice.value?.periodFrom ? fmt(invoice.value.periodFrom) : formatShort(monthShift(0))));
const periodTo = computed(() => (invoice.value?.periodTo ? fmt(invoice.value.periodTo) : formatDate(new Date(today().getFullYear(), today().getMonth() + 1, 0))));
const dueDate = computed(() => (currentInvoice.value?.dueAt ? fmt(currentInvoice.value.dueAt) : formatDate(shiftDays(7))));

const payLines = computed(() => {
  if (invoice.value?.lines?.length) {
    return invoice.value.lines.map((l) => ({
      name: t('pro.dialogs.pay.lineName', {tier: t(`pro.tiers.${l.tier}.name`), days: l.days}),
      qty: String(l.qty),
      price: money(l.price),
      sum: money(l.sum),
    }));
  }
  return ['basic', 'unlim'].map((tier) => {
    const count = paidList.value.filter((k) => k.tier === tier).length;
    return {
      name: t('pro.dialogs.pay.lineName', {tier: t(`pro.tiers.${tier}.name`), days: 30}),
      qty: String(count),
      price: money(tierPrice(tier)),
      sum: money(count * tierPrice(tier)),
    };
  });
});
</script>
