<template>
  <div class="pro-analytics__stats">
    <div
      v-for="stat in stats"
      :key="stat.label"
      :class="{'pro-analytics__stat--raised': stat.raised}"
      class="pro-analytics__stat"
    >
      <div class="pro-analytics__stat-label">{{ stat.label }}</div>
      <div :class="`pro-analytics__stat-value--${stat.tone}`" class="pro-analytics__stat-value">{{ stat.value }}</div>
      <div class="pro-analytics__stat-hint">{{ stat.hint }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Array,
    required: true,
  },
});
</script>
