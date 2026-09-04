<template>
  <ProDialog
    :max-width="580"
    :primary-label="t('pro.dialogs.common.save')"
    :title="t('pro.dialogs.note.title')"
    @close="emit('close')"
    @primary="emit('save', text.trim())"
  >
    <div class="pro-dialog__body">
      <div class="pro-dialog__key-row">
        <div class="pro-dialog__key-row-label">{{ t('pro.dialogs.sold.keyLabel') }}</div>
        <div class="pro-dialog__key-row-value">{{ keyLabel }}</div>
      </div>
      <div class="pro-dialog__question">{{ t('pro.dialogs.note.hint') }}</div>
      <div class="pro-dialog__input-box">
        <textarea
          v-model="text"
          :maxlength="PRO_LIMITS.note"
          :placeholder="t('pro.dialogs.note.placeholder')"
          class="pro-dialog__textarea"
          rows="4"
        ></textarea>
        <div class="pro-dialog__counter">{{ text.length }} / {{ PRO_LIMITS.note }}</div>
      </div>
      <div class="pro-dialog__warning">{{ t('pro.dialogs.common.piiWarningShort') }}</div>
      <div class="pro-dialog__foot-note">{{ t('pro.dialogs.note.foot') }}</div>
    </div>
  </ProDialog>
</template>

<script setup>
import {computed, ref} from 'vue';
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

const text = ref(props.keyItem.note || '');
const keyLabel = computed(() => props.keyItem.user + (props.keyItem.name ? ` · ${props.keyItem.name}` : ''));
</script>
