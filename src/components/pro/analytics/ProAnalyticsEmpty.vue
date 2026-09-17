<template>
  <div :class="`pro-analytics__empty--${kind}`" class="pro-analytics__empty">
    <div class="pro-analytics__empty-title">{{ t(`pro.analytics.empty.${kind}.title`) }}</div>
    <div class="pro-analytics__empty-text">{{ t(`pro.analytics.empty.${kind}.text`) }}</div>
    <button class="pro-analytics__empty-cta" type="button" @click="emit('action')">
      {{ t(`pro.analytics.empty.${kind}.cta`) }} →
    </button>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

// Пустые состояния аналитики: noPaid - нет платных ключей (вместо всей
// аналитики), noPrices - платные есть, но ни одной цены продажи (над панелями).
defineProps({
  kind: {
    type: String,
    required: true,
    validator: (v) => ['noPaid', 'noPrices'].includes(v),
  },
});

const emit = defineEmits(['action']);

const {t} = useI18n();
</script>
