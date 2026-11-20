<template>
  <div :class="`pro-reaction--${tone}`" class="pro-reaction">
    <img :alt="caption" :src="sticker" class="pro-reaction__sticker">
    <div class="pro-reaction__content">
      <div class="pro-reaction__label">{{ t('pro.reactions.label') }}</div>
      <div class="pro-reaction__title">{{ t(`pro.reactions.${id}.title`) }}</div>
      <p v-for="(line, i) in lines" :key="i" class="pro-reaction__text">{{ line }}</p>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {stickerFor} from '@/assets/images/pro/achievements';

// Реакция кабанчика на цифры (не ачивка): показывается, пока держится условие.
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const {t, locale} = useI18n();

const tone = computed(() => props.id.replace(/_/g, '-'));
const sticker = computed(() => stickerFor(props.id, locale.value));
const caption = computed(() => t(`pro.reactions.${props.id}.caption`));
const lines = computed(() => t(`pro.reactions.${props.id}.body`).split('\n').filter(Boolean));
</script>
