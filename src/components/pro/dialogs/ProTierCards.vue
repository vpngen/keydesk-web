<template>
  <div class="pro-tier-cards">
    <button
      v-for="tier in tiers"
      :key="tier"
      :aria-pressed="modelValue === tier"
      :class="{
        'pro-tier-card--active': modelValue === tier,
        'pro-tier-card--recommended': tier === recommended,
      }"
      class="pro-tier-card"
      type="button"
      @click="emit('update:modelValue', tier)"
    >
      <div class="pro-tier-card__head">
        <span v-if="radio" class="pro-tier-card__dot"></span>
        <div class="pro-tier-card__name">{{ t(`pro.tiers.${tier}.name`) }}</div>
        <div class="pro-tier-card__price">{{ t(`pro.tiers.${tier}.price`) }}</div>
      </div>
      <div class="pro-tier-card__body">{{ t(`pro.tiers.${tier}.desc`) }}</div>
      <div v-if="tier === recommended" class="pro-tier-card__badge">★ {{ t('pro.dialogs.upgrade.recommended') }}</div>
    </button>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

// Горизонтальные карточки тарифов: вся карточка кликабельна.
defineProps({
  modelValue: {
    type: [String, null],
    default: null,
  },
  tiers: {
    type: Array,
    default: () => ['free', 'basic', 'unlim'],
  },
  // Тариф с плашкой «Рекомендуем» (апгрейд: Unlim).
  recommended: {
    type: String,
    default: '',
  },
  // Радио-точка в шапке карточки.
  radio: {type: Boolean},
});

const emit = defineEmits(['update:modelValue']);

const {t} = useI18n();
</script>
