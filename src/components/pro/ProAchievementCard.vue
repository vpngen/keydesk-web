<template>
  <ProDialog
    :has-cancel="false"
    :max-width="520"
    :primary-label="t('pro.achievements.button')"
    :title="t('pro.achievements.label')"
    @close="emit('close')"
    @primary="emit('close')"
  >
    <div class="pro-dialog__body pro-achievement">
      <img :alt="caption" :src="sticker" class="pro-achievement__sticker">
      <div class="pro-achievement__title">{{ t(`pro.achievements.${id}.title`) }}</div>
      <p v-for="(line, i) in lines" :key="i" class="pro-achievement__text">{{ line }}</p>
    </div>
  </ProDialog>
</template>

<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import ProDialog from '@/components/pro/dialogs/ProDialog.vue';
import {stickerFor} from '@/assets/images/pro/achievements';

// Карточка ачивки: стикер, заголовок, текст, одна кнопка. Тексты - в локалях
// под pro.achievements.<id>, абзацы разделены \n.
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close']);

const {t, locale} = useI18n();

const sticker = computed(() => stickerFor(props.id, locale.value));
const caption = computed(() => t(`pro.achievements.${props.id}.caption`));
const lines = computed(() => t(`pro.achievements.${props.id}.body`).split('\n').filter(Boolean));
</script>
