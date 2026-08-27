<template>
  <div class="pro-page">
    <RouterLink :to="{path: '/', query: route.query}" class="pro-page__back">
      ← {{ t('pro.nav.backToKeys') }}
    </RouterLink>

    <div class="pro-page__header">
      <div class="pro-page__header-main">
        <div class="pro-page__eyebrow">{{ t('pro.invoices.account', {num: accountNumber}) }}</div>
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

    <div class="pro-invoices__grid">
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
import {useProfileStore} from '@/store/profile';
import {money, invoiceNumber, monthShift, formatDate, today} from '@/utils/proFormat';

const {t, tm} = useI18n();
const route = useRoute();
const proKeysStore = useProKeysStore();
const billingStore = useProBillingStore();
const toastStore = useProToastStore();
const profileStore = useProfileStore();

const {paidList, forecastSum} = storeToRefs(proKeysStore);
const {status, invoices} = storeToRefs(billingStore);
const {uuid} = storeToRefs(profileStore);

const showDialogPay = ref(false);

const accountNumber = computed(() => (uuid.value ? `#${uuid.value.replace(/-/g, '').slice(0, 6)}` : '#112233'));

const periodLabel = (offset) => {
  const d = monthShift(offset);
  const months = tm('pro.months.short');
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
};

const dueDanger = computed(() => status.value !== 'paid');
const dueText = computed(() => (status.value === 'paid' ? money(0) : money(forecastSum.value)));

const paidYearText = computed(() => {
  const past = invoices.value.reduce((sum, i) => sum + (i.status === 'paid' ? i.sum : 0), 0);
  return money(past + (status.value === 'paid' ? forecastSum.value : 0));
});

const invoiceCards = computed(() => {
  const cards = [];
  const paidCount = paidList.value.length;
  const forecastMoney = money(forecastSum.value);

  cards.push({
    num: invoiceNumber(1),
    period: periodLabel(1),
    created: '—',
    paidAt: '—',
    keys: paidCount,
    sum: forecastMoney,
    status: 'forecast',
    tone: 'plain',
    payable: false,
  });

  if (status.value !== 'paid') {
    cards.push({
      num: invoiceNumber(0),
      period: periodLabel(0),
      created: formatDate(monthShift(0)),
      paidAt: '—',
      keys: paidCount,
      sum: forecastMoney,
      status: status.value === 'issued' ? 'awaiting' : 'overdue',
      tone: status.value === 'issued' ? 'issued' : 'overdue',
      sumDanger: true,
      payable: true,
    });
  } else {
    cards.push({
      num: invoiceNumber(0),
      period: periodLabel(0),
      created: formatDate(monthShift(0)),
      paidAt: formatDate(today()),
      keys: paidCount,
      sum: forecastMoney,
      status: 'paid',
      tone: 'plain',
      payable: false,
    });
  }

  invoices.value.forEach((invoice, idx) => {
    cards.push({
      num: invoice.num,
      period: periodLabel(invoice.periodOffset),
      created: invoice.created,
      paidAt: invoice.paidAt || '—',
      keys: invoice.keys,
      sum: money(invoice.sum),
      status: invoice.status,
      tone: 'plain',
      alt: idx % 2 === 1,
      payable: false,
    });
  });

  return cards;
});

const openInvoice = (invoice) => {
  if (invoice.status === 'forecast') {
    toastStore.show(t('pro.toasts.forecastNotIssued'));
    return;
  }
  if (invoice.payable) {
    showDialogPay.value = true;
    return;
  }
  toastStore.show(invoice.paidAt !== '—' && invoice.num === invoiceNumber(0)
    ? t('pro.toasts.receiptDownloaded')
    : t('pro.toasts.invoiceDownloaded', {num: invoice.num}));
};

const payInvoice = async () => {
  await billingStore.payCurrentInvoice();
  showDialogPay.value = false;
  toastStore.show(t('pro.toasts.invoicePaid'));
};
</script>
