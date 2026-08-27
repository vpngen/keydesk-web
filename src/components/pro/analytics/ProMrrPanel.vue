<template>
  <div class="pro-analytics__panel">
    <div class="pro-analytics__panel-head">
      <div class="pro-analytics__panel-title">{{ t('pro.analytics.mrrTitle') }}</div>
    </div>
    <div class="pro-analytics__mrr">
      <svg class="pro-analytics__mrr-chart" viewBox="0 0 320 120">
        <line stroke="#c6bda5" stroke-width="1" x1="0" x2="320" y1="119" y2="119"></line>
        <line stroke="#e0d8c2" stroke-dasharray="3 4" stroke-width="1" x1="0" x2="320" y1="60" y2="60"></line>
        <polyline :points="points" fill="none" stroke="#2b4a78" stroke-width="2.5"></polyline>
        <polyline :points="points" fill="none" opacity="0.1" stroke="#2b4a78" stroke-width="7"></polyline>
      </svg>
      <div class="pro-analytics__growth">
        <div v-for="row in rows" :key="row.label" :title="row.tip || ''" class="pro-analytics__growth-row">
          <div class="pro-analytics__growth-label">{{ row.label }}</div>
          <div :class="`pro-analytics__growth-value--${row.tone}`" class="pro-analytics__growth-value">{{ row.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

defineProps({
  points: {
    type: String,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
});

const {t} = useI18n();
</script>
