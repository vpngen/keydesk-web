<template>
  <div class="pro-analytics__panel">
    <div class="pro-analytics__panel-head">
      <div class="pro-analytics__panel-title">{{ t('pro.analytics.chart.title') }}</div>
      <div class="pro-analytics__panel-unit">
        {{ t('pro.analytics.chart.unit') }}
        <ProHint :text="t('pro.analytics.chart.tip')"/>
      </div>
    </div>
    <div class="pro-analytics__panel-sub">{{ t('pro.analytics.chart.sub') }}</div>
    <div class="pro-analytics__bars">
      <button
        v-for="bar in bars"
        :key="bar.key"
        :aria-label="bar.aria"
        :class="{'pro-analytics__bar-col--active': activeKey === bar.key}"
        class="pro-analytics__bar-col"
        type="button"
        @blur="activeKey = null"
        @click="toggle(bar.key)"
        @focus="activeKey = bar.key"
        @mouseenter="activeKey = bar.key"
        @mouseleave="activeKey = null"
      >
        <!-- Детализация месяца: выручка, расходы на ключи, прибыль (hover / клик / фокус). -->
        <div v-if="activeKey === bar.key && bar.detail" class="pro-analytics__tooltip">
          <div class="pro-analytics__tooltip-title">{{ bar.detail.title }}</div>
          <div v-for="row in bar.detail.rows" :key="row.label" class="pro-analytics__tooltip-row">
            <span>{{ row.label }}</span>
            <span>{{ row.value }}</span>
          </div>
        </div>
        <div :class="{'pro-analytics__bar-value--last': bar.isLast}" class="pro-analytics__bar-value">{{ bar.value }}</div>
        <div :class="{'pro-analytics__bar--last': bar.isLast, 'pro-analytics__bar--empty': !bar.detail}" :style="{height: bar.height}" class="pro-analytics__bar"></div>
      </button>
    </div>
    <div class="pro-analytics__bar-labels">
      <div v-for="bar in bars" :key="bar.key" :class="{'pro-analytics__bar-label--last': bar.isLast}" class="pro-analytics__bar-label">
        {{ bar.label }}
        <span v-if="bar.sub" class="pro-analytics__bar-sublabel">{{ bar.sub }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import ProHint from '@/components/pro/analytics/ProHint.vue';

// Столбцы: {key, label, sub, value, height, isLast, aria, detail: {title, rows[{label, value}]} | null}.
defineProps({
  bars: {
    type: Array,
    required: true,
  },
});

const {t} = useI18n();

const activeKey = ref(null);

const toggle = (key) => {
  activeKey.value = activeKey.value === key ? null : key;
};
</script>
