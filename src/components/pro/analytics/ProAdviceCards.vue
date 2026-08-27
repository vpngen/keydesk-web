<template>
  <div class="pro-analytics__advice">
    <div class="pro-analytics__advice-header">
      <div class="pro-analytics__advice-title">{{ t('pro.analytics.adviceTitle') }}</div>
      <div class="pro-analytics__advice-rule"></div>
      <div class="pro-analytics__advice-sub">{{ t('pro.analytics.adviceSub') }}</div>
    </div>
    <div class="pro-analytics__advice-grid">
      <div
        v-for="card in cards"
        :key="card.id"
        :class="`pro-advice-card--${card.tone}`"
        class="pro-advice-card"
      >
        <div class="pro-advice-card__main">
          <div class="pro-advice-card__number">{{ card.n }}</div>
          <div class="pro-advice-card__content">
            <div class="pro-advice-card__title">{{ card.title }}</div>
            <div class="pro-advice-card__body">{{ card.body }}</div>
          </div>
        </div>
        <div class="pro-advice-card__foot">
          <button class="pro-advice-card__cta" type="button" @click="emit('action', card.id)">
            {{ card.cta }}
          </button>
          <div class="pro-advice-card__note">{{ card.foot }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

defineProps({
  cards: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['action']);

const {t} = useI18n();
</script>
