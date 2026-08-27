<template>
  <div class="pro-analytics__panel">
    <div class="pro-analytics__panel-head">
      <div class="pro-analytics__panel-title">{{ t('pro.analytics.chartTitle') }}</div>
      <div class="pro-analytics__panel-unit">{{ t('pro.analytics.chartUnit') }}</div>
    </div>
    <div class="pro-analytics__bars">
      <div v-for="bar in bars" :key="bar.label" class="pro-analytics__bar-col">
        <div :class="{'pro-analytics__bar-value--last': bar.isLast}" class="pro-analytics__bar-value">{{ bar.value }}</div>
        <div :class="{'pro-analytics__bar--last': bar.isLast}" :style="{height: bar.height}" class="pro-analytics__bar"></div>
      </div>
    </div>
    <div class="pro-analytics__bar-labels">
      <div v-for="bar in bars" :key="bar.label" class="pro-analytics__bar-label">{{ bar.label }}</div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

defineProps({
  bars: {
    type: Array,
    required: true,
  },
});

const {t} = useI18n();
</script>
