<template>
  <div class="pro-done">
    <div class="pro-done__head">
      <div class="pro-done__stamp">{{ stamp }}</div>
      <div class="pro-done__when">{{ when }}</div>
    </div>
    <div class="pro-done__text">
      <div class="pro-done__title">{{ title }}</div>
      <div class="pro-done__sub">{{ sub }}</div>
    </div>
    <div v-if="keyValue" class="pro-done__key">
      <div class="pro-done__key-value">{{ keyValue }}</div>
      <button class="pro-done__key-copy" type="button" @click="copyKey">
        {{ t('pro.dialogs.done.copy') }}
      </button>
    </div>
    <div class="pro-done__note">{{ note }}</div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import {useProToastStore} from '@/store/proToast';
import {formatDate, today} from '@/utils/proFormat';

const props = defineProps({
  stamp: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  sub: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  keyValue: {
    type: String,
    default: '',
  },
});

const {t} = useI18n();
const toastStore = useProToastStore();

const now = new Date();
const when = `${formatDate(today())}, ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

const copyKey = async () => {
  try {
    await navigator.clipboard.writeText(props.keyValue);
  } catch {
    /* клипборд недоступен — тост показываем всё равно */
  }
  toastStore.show(t('pro.toasts.keyCopied'));
};
</script>
