<template>
  <div :class="`pro-banner--${status}`" class="pro-banner">
    <div class="pro-banner__header" @click="isOpen = !isOpen">
      <div class="pro-banner__label">{{ t('pro.banner.statusLabel') }}</div>
      <div class="pro-banner__title">PRO</div>
      <div class="pro-banner__stamp">{{ t(`pro.banner.${status}.stamp`) }}</div>
      <div class="pro-banner__spacer"></div>
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
      <div class="pro-banner__actions">
        <button v-if="hasPay" class="pro-banner__cta" type="button" @click="emit('pay')">
          {{ t(`pro.banner.${status}.cta`) }}
        </button>
        <RouterLink :to="{path: '/invoices', query: route.query}" class="pro-banner__link">
          {{ t('pro.banner.allInvoices') }} →
        </RouterLink>
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
import {money, formatDate, nextBilling, daysToBilling, shiftDays, invoiceNumber} from '@/utils/proFormat';

const emit = defineEmits(['pay']);

const {t} = useI18n();
const route = useRoute();
const proKeysStore = useProKeysStore();
const billingStore = useProBillingStore();
const {keysList, paidList, forecastSum, freeCount} = storeToRefs(proKeysStore);
const {status} = storeToRefs(billingStore);

const isOpen = ref(false);

const hasPay = computed(() => status.value !== 'paid');
const hasNote = computed(() => status.value === 'overdue' || status.value === 'suspended');

const cells = computed(() => {
  const forecastMoney = money(forecastSum.value);
  const paidCount = paidList.value.length;
  const free = freeCount.value;
  const paidOutside = keysList.value.length - free - paidCount;
  const outsideText = paidOutside > 0
    ? t('pro.banner.outsideBoth', {free, paid: paidOutside})
    : t('pro.banner.outsideFree', {free});

  if (status.value === 'issued') {
    return [
      {label: t('pro.banner.issued.l1'), value: forecastMoney, sub: t('pro.banner.issued.s1', {num: invoiceNumber(0)}), tone: 'ink'},
      {label: t('pro.banner.issued.l2'), value: formatDate(shiftDays(2)), sub: t('pro.banner.issued.s2'), tone: 'amber'},
      {label: t('pro.banner.issued.l3'), value: String(paidCount), sub: t('pro.banner.outsideFree', {free}), tone: 'ink'},
    ];
  }
  if (status.value === 'overdue') {
    return [
      {label: t('pro.banner.overdue.l1'), value: forecastMoney, sub: t('pro.banner.overdue.s1', {date: formatDate(shiftDays(-3))}), tone: 'danger'},
      {label: t('pro.banner.overdue.l2'), value: formatDate(shiftDays(4)), sub: t('pro.banner.overdue.s2'), tone: 'danger'},
      {label: t('pro.banner.overdue.l3'), value: t('pro.banner.overdue.v3'), sub: t('pro.banner.overdue.s3'), tone: 'ink'},
    ];
  }
  if (status.value === 'suspended') {
    return [
      {label: t('pro.banner.suspended.l1'), value: forecastMoney, sub: t('pro.banner.suspended.s1', {num: invoiceNumber(0)}), tone: 'ink'},
      {label: t('pro.banner.suspended.l2'), value: formatDate(shiftDays(-1)), sub: t('pro.banner.suspended.s2', {count: paidCount}), tone: 'ink'},
      {label: t('pro.banner.suspended.l3'), value: t('pro.banner.suspended.v3', {free}), sub: t('pro.banner.suspended.s3'), tone: 'ink'},
    ];
  }
  return [
    {label: t('pro.banner.paid.l1'), value: formatDate(nextBilling()), sub: t('pro.banner.paid.s1', {days: daysToBilling()}), tone: 'ink'},
    {label: t('pro.banner.paid.l2'), value: forecastMoney, sub: t('pro.banner.paid.s2'), tone: 'ink'},
    {label: t('pro.banner.paid.l3'), value: t('pro.banner.paid.v3', {paid: paidCount, total: keysList.value.length}), sub: outsideText, tone: 'ink'},
  ];
});
</script>
