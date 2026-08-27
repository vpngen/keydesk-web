<template>
  <div class="pro-review">
    <div class="pro-review__rows">
      <div v-for="(row, i) in rows" :key="i" class="pro-review__row">
        <div class="pro-review__row-label">{{ row.label }}</div>
        <div class="pro-review__row-value">{{ row.value }}</div>
      </div>
    </div>
    <div class="pro-review__invoice">
      <div class="pro-review__invoice-title">{{ t('pro.dialogs.review.invoiceTitle') }}</div>
      <div class="pro-review__invoice-body">
        <div class="pro-review__invoice-line">
          <div>{{ t('pro.dialogs.review.prorateLine', {days: prorateDays}) }}</div>
          <div class="pro-review__invoice-sum">{{ prorateSum }}</div>
        </div>
        <div class="pro-review__invoice-line">
          <div>{{ t('pro.dialogs.review.monthlyLine') }}</div>
          <div class="pro-review__invoice-sum pro-review__invoice-sum--faded">{{ monthlyPrice }}</div>
        </div>
        <div class="pro-review__invoice-total">
          <div class="pro-review__invoice-total-label">{{ t('pro.dialogs.review.invoiceAt', {date: nextInvoiceDate}) }}</div>
          <div class="pro-review__invoice-total-sum">{{ forecastAfter }}</div>
        </div>
      </div>
    </div>
    <div class="pro-dialog__info">{{ t('pro.dialogs.review.payNote') }}</div>
    <div class="pro-review__forecast">
      <div class="pro-review__forecast-label">{{ t('pro.dialogs.review.forecastWas', {date: nextInvoiceDate}) }}</div>
      <div class="pro-review__forecast-value">
        <span class="pro-review__forecast-old">{{ forecastNow }}</span> → {{ forecastAfter }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

defineProps({
  rows: {
    type: Array,
    required: true,
  },
  prorateDays: {
    type: [Number, String],
    required: true,
  },
  prorateSum: {
    type: String,
    required: true,
  },
  monthlyPrice: {
    type: String,
    required: true,
  },
  nextInvoiceDate: {
    type: String,
    required: true,
  },
  forecastNow: {
    type: String,
    required: true,
  },
  forecastAfter: {
    type: String,
    required: true,
  },
});

const {t} = useI18n();
</script>
