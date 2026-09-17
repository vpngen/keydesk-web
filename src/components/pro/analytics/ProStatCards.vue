<template>
  <div class="pro-analytics__stats">
    <div
      v-for="stat in stats"
      :key="stat.id"
      :class="{'pro-analytics__stat--main': stat.main}"
      class="pro-analytics__stat"
    >
      <div class="pro-analytics__stat-label">
        {{ stat.label }}
        <ProHint v-if="stat.tip" :text="stat.tip"/>
      </div>
      <div :class="`pro-analytics__stat-value--${stat.tone}`" class="pro-analytics__stat-value">{{ stat.value }}</div>
      <div class="pro-analytics__stat-hint">{{ stat.hint }}</div>
    </div>
  </div>
</template>

<script setup>
import ProHint from '@/components/pro/analytics/ProHint.vue';

// Три карточки экономики: {id, label, value, hint, tip, tone, main}.
defineProps({
  stats: {
    type: Array,
    required: true,
  },
});
</script>
