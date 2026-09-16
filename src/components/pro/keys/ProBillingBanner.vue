<template>
  <div :class="`pro-banner--${status}`" class="pro-banner" data-tour="banner">
    <div class="pro-banner__header" @click="isOpen = !isOpen">
      <div class="pro-banner__label">{{ t('pro.banner.statusLabel') }}</div>
      <div class="pro-banner__title">PRO</div>
      <div class="pro-banner__stamp">{{ t(`pro.banner.${status}.stamp`) }}</div>
      <div class="pro-banner__spacer"></div>
      <!-- Вход в раздел оплаты (пункт меню «Инвойсы» скрыт) -->
      <RouterLink :to="{path: '/invoices', query: route.query}" class="pro-banner__link" @click.stop>
        {{ t('pro.banner.payLink') }}
      </RouterLink>
      <div class="pro-banner__chevron">{{ isOpen ? '▴' : '▾' }}</div>
    </div>
    <template v-if="isOpen">
      <div class="pro-banner__cells">
        <div v-for="(cell, i) in cells" :key="i" class="pro-banner__cell">
          <div class="pro-banner__cell-label">{{ cell.label }}</div>
          <div :class="[`pro-banner__cell-value--${cell.tone}`, {'pro-banner__cell-value--strong': i === 0}]" class="pro-banner__cell-value">
            {{ cell.value }}
          </div>
          <div class="pro-banner__cell-sub">{{ cell.sub }}</div>
        </div>
      </div>
      <div v-if="immediateCharges && cycleEndDate" class="pro-banner__note">
        {{ t('pro.banner.cycle0Note', {end: cycleEndDate, date: nextInvoiceDate}) }}
      </div>
      <div v-if="hasPay" class="pro-banner__actions">
        <button class="pro-banner__cta" type="button" @click="emit('pay')">
          {{ t(`pro.banner.${status}.cta`) }}
        </button>
      </div>
    </template>
    <div v-if="hasNote" class="pro-banner__note">{{ t(`pro.banner.${status}.note`) }}</div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {RouterLink, useRoute} from 'vue-router';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useProKeysStore} from '@/store/proKeys';
import {useProBillingStore} from '@/store/proBilling';
import {money, formatDate, daysUntil, toIso, nextBilling, daysToBilling} from '@/utils/proFormat';

const emit = defineEmits(['pay']);

const {t} = useI18n();
const route = useRoute();
const proKeysStore = useProKeysStore();
const billingStore = useProBillingStore();
const {keysList, paidList, forecastSum, freeCount} = storeToRefs(proKeysStore);
const {status, currentInvoice, invoices, immediateCharges, cycleEnd, nextInvoiceAt, estimate} = storeToRefs(billingStore);

const isOpen = ref(false);

const hasPay = computed(() => status.value === 'issued' || status.value === 'overdue');
const hasNote = computed(() => status.value === 'overdue');

const fmt = (iso) => (iso ? formatDate(new Date(iso)) : '');
const cycleEndDate = computed(() => fmt(cycleEnd.value));
const nextInvoiceDate = computed(() => (nextInvoiceAt.value ? fmt(nextInvoiceAt.value) : formatDate(nextBilling())));
const daysToInvoice = computed(() => (nextInvoiceAt.value ? daysUntil(toIso(new Date(nextInvoiceAt.value))) : daysToBilling()));

// Предварительный расчёт следующего инвойса: с бэкенда (по дням), в моке - прогноз по ключам.
const estimateSum = computed(() => (estimate.value ? estimate.value.sum : forecastSum.value));
const estimateKeys = computed(() => (estimate.value ? estimate.value.keys : paidList.value.length));

const invoiceSum = computed(() => money(currentInvoice.value?.sum ?? estimateSum.value));
const invoiceNum = computed(() => currentInvoice.value?.num || nextInvoiceDate.value);
const invoiceKeys = computed(() => invoices.value.find((i) => i.num === currentInvoice.value?.num)?.keys ?? estimateKeys.value);
const dueDate = computed(() => fmt(currentInvoice.value?.dueAt));
const daysToDue = computed(() => (currentInvoice.value?.dueAt ? Math.max(0, daysUntil(toIso(new Date(currentInvoice.value.dueAt)))) : 0));

const cells = computed(() => {
  const free = freeCount.value;

  if (status.value === 'issued') {
    return [
      {label: t('pro.banner.issued.l1'), value: invoiceSum.value, sub: t('pro.banner.issued.s1', {num: invoiceNum.value}), tone: 'ink'},
      {label: t('pro.banner.issued.l2'), value: dueDate.value, sub: t('pro.banner.issued.s2', {days: daysToDue.value}), tone: 'amber'},
      {label: t('pro.banner.issued.l3'), value: String(invoiceKeys.value), sub: t('pro.banner.outsideFree', {free}), tone: 'ink'},
    ];
  }
  if (status.value === 'overdue') {
    return [
      {label: t('pro.banner.overdue.l1'), value: invoiceSum.value, sub: t('pro.banner.overdue.s1', {date: dueDate.value}), tone: 'danger'},
      {label: t('pro.banner.overdue.l2'), value: t('pro.banner.overdue.v2'), sub: t('pro.banner.overdue.s2'), tone: 'danger'},
      {label: t('pro.banner.overdue.l3'), value: String(invoiceKeys.value), sub: t('pro.banner.outsideFree', {free}), tone: 'ink'},
    ];
  }
  return [
    {label: t('pro.banner.paid.l1'), value: nextInvoiceDate.value, sub: t('pro.banner.paid.s1', {days: daysToInvoice.value}), tone: 'ink'},
    {label: t('pro.banner.paid.l2'), value: money(estimateSum.value), sub: t('pro.banner.paid.s2'), tone: 'ink'},
    {label: t('pro.banner.paid.l3'), value: t('pro.banner.paid.v3', {paid: estimateKeys.value, total: keysList.value.length}), sub: t('pro.banner.outsideFree', {free}), tone: 'ink'},
  ];
});
</script>
