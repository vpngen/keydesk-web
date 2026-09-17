<template>
  <div class="pro-analytics__panel">
    <div class="pro-analytics__panel-head">
      <div class="pro-analytics__panel-title">
        {{ t('pro.analytics.renewals.title') }}
        <ProHint :text="t('pro.analytics.renewals.tip')"/>
      </div>
    </div>
    <div class="pro-analytics__renewals">
      <template v-if="isFinal">
        <div class="pro-analytics__renewals-main">
          <div class="pro-analytics__donut-wrap">
            <svg class="pro-analytics__donut" viewBox="0 0 120 120">
              <circle class="pro-analytics__donut-track" cx="60" cy="60" fill="none" r="48" stroke-width="14"></circle>
              <circle
                :stroke-dasharray="`${dash} ${circumference}`"
                class="pro-analytics__donut-arc"
                cx="60"
                cy="60"
                fill="none"
                r="48"
                stroke-width="14"
                transform="rotate(-90 60 60)"
              ></circle>
            </svg>
            <div class="pro-analytics__donut-value">{{ renewals.rate }}%</div>
          </div>
          <div class="pro-analytics__renewals-text">
            <div class="pro-analytics__renewals-count">
              {{ t('pro.analytics.renewals.count', {renewed: renewals.renewed, eligible: renewals.eligible}, renewals.eligible) }}
            </div>
            <div v-if="renewals.changePp !== null" :class="`pro-analytics__renewals-change--${changeTone}`" class="pro-analytics__renewals-change">
              {{ changeArrow }} {{ t('pro.analytics.renewals.change', {pp: changeText}) }}
            </div>
          </div>
        </div>
      </template>
      <div v-else class="pro-analytics__renewals-empty">
        <div class="pro-analytics__renewals-empty-title">{{ emptyTitle }}</div>
        <div class="pro-analytics__renewals-empty-text">{{ emptyText }}</div>
      </div>
      <div class="pro-analytics__note pro-analytics__note--boxed">
        <span class="pro-analytics__note-icon">i</span>
        <span>{{ t('pro.analytics.renewals.tip') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import ProHint from '@/components/pro/analytics/ProHint.vue';

const props = defineProps({
  // renewals из GET /pro/analytics: {status, eligible, renewed, rate, changePp, good}.
  renewals: {
    type: Object,
    required: true,
  },
  // Индекс расчетного периода: в первом периоде продлевать еще нечего.
  periodIndex: {
    type: Number,
    default: 0,
  },
});

const {t} = useI18n();

const circumference = 2 * Math.PI * 48;
const dash = computed(() => Math.max(0, Math.min(100, props.renewals.rate)) / 100 * circumference);

const isFinal = computed(() => props.renewals.status === 'final');

const changeTone = computed(() => (props.renewals.changePp > 0 ? 'green' : props.renewals.changePp < 0 ? 'red' : 'muted'));
const changeArrow = computed(() => (props.renewals.changePp > 0 ? '↑' : props.renewals.changePp < 0 ? '↓' : '→'));
const changeText = computed(() => `${props.renewals.changePp > 0 ? '+' : ''}${props.renewals.changePp}`);

// Нет данных: первый расчетный период - своя формулировка; инвойс ещё
// можно оплатить - промежуточный процент не показываем.
const emptyTitle = computed(() => (props.renewals.status === 'calculating'
  ? t('pro.analytics.renewals.calculating.title')
  : t('pro.analytics.renewals.noData.title')));

const emptyText = computed(() => {
  if (props.renewals.status === 'calculating') return t('pro.analytics.renewals.calculating.text');
  return props.periodIndex === 0 ? t('pro.analytics.renewals.noData.first') : t('pro.analytics.renewals.noData.text');
});
</script>
