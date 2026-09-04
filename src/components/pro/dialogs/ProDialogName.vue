<template>
  <ProDialog
    :primary-label="t('pro.dialogs.common.save')"
    :title="`${t('pro.dialogs.name.title')} · ${keyItem.user}`"
    @close="emit('close')"
    @primary="emit('save', text.trim())"
  >
    <div class="pro-dialog__body">
      <div class="pro-dialog__question">{{ t('pro.dialogs.name.hint') }}</div>
      <div class="pro-dialog__input-box">
        <input
          v-model="text"
          :maxlength="PRO_LIMITS.name"
          :placeholder="t('pro.dialogs.create.namePlaceholder')"
          class="pro-dialog__input"
          type="text"
        >
        <div class="pro-dialog__counter">{{ text.length }} / {{ PRO_LIMITS.name }}</div>
      </div>
      <div class="pro-dialog__warning">{{ t('pro.dialogs.common.piiWarning') }}</div>
      <div class="pro-dialog__foot-note">{{ t('pro.dialogs.create.nameFoot') }}</div>
    </div>
  </ProDialog>
</template>

<script setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import ProDialog from '@/components/pro/dialogs/ProDialog.vue';
import {PRO_LIMITS} from '@/assets/constants/proConstants';

const props = defineProps({
  keyItem: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'save']);

const {t} = useI18n();

const text = ref(props.keyItem.name || '');
</script>
