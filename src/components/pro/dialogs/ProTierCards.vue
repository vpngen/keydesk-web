<template>
  <div class="pro-tier-cards">
    <button
      v-for="tier in tiers"
      :key="tier"
      :class="{'pro-tier-card--active': modelValue === tier}"
      class="pro-tier-card"
      type="button"
      @click="emit('update:modelValue', tier)"
    >
      <div class="pro-tier-card__head">
        <div class="pro-tier-card__name">{{ t(`pro.tiers.${tier}.name`) }}</div>
        <div class="pro-tier-card__price">{{ t(`pro.tiers.${tier}.price`) }}</div>
      </div>
      <div class="pro-tier-card__body">{{ t(`pro.tiers.${tier}.desc`) }}</div>
    </button>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

defineProps({
  modelValue: {
    type: [String, null],
    default: null,
  },
  tiers: {
    type: Array,
    default: () => ['free', 'basic', 'unlim'],
  },
});

const emit = defineEmits(['update:modelValue']);

const {t} = useI18n();
</script>
