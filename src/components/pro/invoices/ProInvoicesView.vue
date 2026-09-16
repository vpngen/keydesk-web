<template>
  <div class="pro-page">
    <RouterLink :to="{path: '/', query: route.query}" class="pro-page__back">
      ← {{ t('pro.nav.backToKeys') }}
    </RouterLink>

    <div class="pro-page__header">
      <div class="pro-page__header-main">
        <div class="pro-page__eyebrow">{{ t('pro.invoices.subtitle') }}</div>
        <h1 class="pro-page__title">{{ t('pro.invoices.title') }}</h1>
      </div>
      <div class="pro-invoices__totals">
        <div class="pro-invoices__total">
          <div class="pro-invoices__total-label">{{ t('pro.invoices.due') }}</div>
          <div :class="{'pro-invoices__total-value--danger': dueDanger}" class="pro-invoices__total-value pro-invoices__total-value--strong">
            {{ dueText }}
          </div>
        </div>
        <div class="pro-invoices__total">
          <div class="pro-invoices__total-label">{{ t('pro.invoices.paidYear') }}</div>
          <div class="pro-invoices__total-value">{{ paidYearText }}</div>
        </div>
      </div>
    </div>

    <!-- Предварительный расчёт следующего инвойса: дата, состав по дням, сумма. -->
    <div class="pro-invoices__state" data-tour="invoices-state">
      <div class="pro-invoices__state-head">
        <div class="pro-invoices__state-title">{{ t('pro.invoices.estimateTitle') }}</div>
        <div class="pro-invoices__state-sum">{{ money(estimateView.sum) }}</div>
      </div>
      <div class="pro-invoices__state-next">{{ t('pro.invoices.estimateNext', {date: estimateView.date}) }}</div>
      <div v-if="estimateView.lines.length" class="pro-invoices__state-lines">
        <div v-for="line in estimateView.lines" :key="line.tier" class="pro-invoices__state-line">
          <div>{{ t('pro.invoices.estimateLine', {tier: t(`pro.tiers.${line.tier}.name`), qty: line.qty, days: line.days}) }}</div>
          <div class="pro-invoices__state-line-sum">{{ money(line.sum) }}</div>
        </div>
      </div>
      <div v-else class="pro-invoices__state-empty">{{ t('pro.invoices.estimateEmpty') }}</div>
      <div class="pro-invoices__state-note">
        <template v-if="immediateCharges && cycleEndDate">{{ t('pro.banner.cycle0Note', {end: cycleEndDate, date: estimateView.date}) }} </template>{{ t('pro.invoices.estimateNote') }}
      </div>
    </div>

    <div v-if="invoiceCards.length" class="pro-invoices__grid">
      <ProInvoiceCard
        v-for="invoice in invoiceCards"
        :key="invoice.num + invoice.status"
        :invoice="invoice"
        @open="openInvoice"
        @pay="showDialogPay = true"
      />
    </div>
  </div>

  <teleport to="#app">
    <ProDialogPay
      v-if="showDialogPay"
      @close="showDialogPay = false"
      @pay="payInvoice"
    />
  </teleport>
</template>

<script setup>
import {computed, ref} from 'vue';
import {RouterLink, useRoute} from 'vue-router';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import ProInvoiceCard from '@/components/pro/invoices/ProInvoiceCard.vue';
import ProDialogPay from '@/components/pro/dialogs/ProDialogPay.vue';
import {useProKeysStore} from '@/store/proKeys';
import {useProBillingStore} from '@/store/proBilling';
import {useProToastStore} from '@/store/proToast';
import {tierPrice} from '@/utils/proKeys';
import {money, formatDate, nextBilling, monthShift, invoiceNumber} from '@/utils/proFormat';

const {t, tm} = useI18n();
const route = useRoute();
const proKeysStore = useProKeysStore();
const billingStore = useProBillingStore();
const toastStore = useProToastStore();

const {paidList, forecastSum} = storeToRefs(proKeysStore);
const {status, invoices, isReal, currentInvoice, immediateCharges, cycleEnd, nextInvoiceAt, estimate} = storeToRefs(billingStore);

const showDialogPay = ref(false);

const fmt = (iso) => (iso ? formatDate(new Date(iso)) : '—');
const cycleEndDate = computed(() => (cycleEnd.value ? fmt(cycleEnd.value) : ''));

// Реальный режим: расчёт по дням с бэкенда. Мок-стенд: прогноз по текущим ключам.
const estimateView = computed(() => {
  if (estimate.value) {
    return {
      sum: estimate.value.sum,
      keys: estimate.value.keys,
      lines: estimate.value.lines,
      date: nextInvoiceAt.value ? fmt(nextInvoiceAt.value) : '—',
    };
  }
  const lines = ['basic', 'unlim']
    .map((tier) => {
      const qty = paidList.value.filter((k) => k.tier === tier).length;
      return {tier, qty, days: 30 * qty, sum: qty * tierPrice(tier)};
    })
    .filter((l) => l.qty > 0);
  return {sum: forecastSum.value, keys: paidList.value.length, lines, date: formatDate(nextBilling())};
});

const dueDanger = computed(() => status.value !== 'paid');
const dueText = computed(() => money(currentInvoice.value?.sum ?? (status.value === 'paid' ? 0 : forecastSum.value)));

const paidYearText = computed(() => money(invoices.value.reduce((sum, i) => sum + (i.status === 'paid' ? i.sum : 0), 0)));

const periodLabelFromId = (id) => {
  const [year, month] = String(id).split('-').map(Number);
  const months = tm('pro.months.short');
  return months[month - 1] ? `${months[month - 1]} ${year}` : String(id);
};

const invoiceCards = computed(() => {
  if (isReal.value) {
    return [...invoices.value].reverse().map((invoice, idx) => {
      const payable = invoice.status === 'awaiting' || invoice.status === 'overdue';
      return {
        num: invoice.num,
        period: invoice.periodFrom ? `${fmt(invoice.periodFrom)} — ${fmt(invoice.periodTo)}` : periodLabelFromId(invoice.periodId),
        created: fmt(invoice.createdAt),
        paidAt: fmt(invoice.paidAtIso),
        keys: invoice.keys,
        sum: money(invoice.sum),
        status: invoice.status,
        tone: invoice.status === 'awaiting' ? 'issued' : invoice.status === 'overdue' ? 'overdue' : 'plain',
        alt: !payable && idx % 2 === 1,
        sumDanger: payable,
        payable,
      };
    });
  }

  // Мок-стенд: посевные инвойсы макета.
  return invoices.value.map((invoice, idx) => ({
    num: invoice.num || invoiceNumber(invoice.periodOffset || 0),
    period: periodLabelFromId(`${monthShift(invoice.periodOffset || 0).getFullYear()}-${monthShift(invoice.periodOffset || 0).getMonth() + 1}`),
    created: invoice.created || '—',
    paidAt: invoice.paidAt || '—',
    keys: invoice.keys,
    sum: money(invoice.sum),
    status: invoice.status,
    tone: 'plain',
    alt: idx % 2 === 1,
    payable: false,
  }));
});

const openInvoice = (invoice) => {
  if (invoice.payable) {
    showDialogPay.value = true;
    return;
  }
  toastStore.show(t('pro.toasts.invoiceDownloaded', {num: invoice.num}));
};

const payInvoice = async () => {
  await billingStore.payCurrentInvoice();
  showDialogPay.value = false;
  toastStore.show(t('pro.toasts.invoicePaid'));
};
</script>
