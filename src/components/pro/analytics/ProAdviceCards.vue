<template>
  <div class="pro-analytics__advice" data-tour="advice">
    <div class="pro-analytics__advice-header">
      <div class="pro-analytics__advice-title">{{ t('pro.analytics.attention.title') }}</div>
      <div class="pro-analytics__advice-rule"></div>
      <div class="pro-analytics__advice-sub">{{ t('pro.analytics.attention.sub') }}</div>
    </div>
    <div class="pro-analytics__advice-grid">
      <div
        v-for="card in cards"
        :key="card.id"
        :class="`pro-advice-card--${card.tone}`"
        class="pro-advice-card"
      >
        <div class="pro-advice-card__main">
          <div class="pro-advice-card__icon">{{ card.icon }}</div>
          <div class="pro-advice-card__content">
            <div class="pro-advice-card__title">{{ card.title }}</div>
            <div class="pro-advice-card__body">{{ card.body }}</div>
          </div>
        </div>
        <div v-if="card.cta" class="pro-advice-card__foot">
          <button class="pro-advice-card__cta" type="button" @click="emit('action', card)">
            {{ card.cta }} →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

// «На что обратить внимание»: проблемные сценарии с CTA в отфильтрованный
// список ключей и позитивные состояния без CTA. {id, tone, icon, title, body, cta?, ids?}.
defineProps({
  cards: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['action']);

const {t} = useI18n();
</script>
