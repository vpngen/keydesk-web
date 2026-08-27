<template>
  <ProDialog
    :cancel-label="t('pro.dialogs.confirm.keep')"
    :max-width="520"
    :primary-label="kind === 'del' ? t('pro.dialogs.confirm.delete') : t('pro.dialogs.confirm.deactivate')"
    :title="kind === 'del' ? t('pro.dialogs.confirm.deleteTitle') : t('pro.dialogs.confirm.deactivateTitle')"
    primary-variant="red"
    @close="emit('close')"
    @primary="emit('confirm')"
  >
    <div class="pro-dialog__body">
      <div class="pro-dialog__question">{{ text }}</div>
      <div class="pro-dialog__confirm-note">{{ note }}</div>
    </div>
  </ProDialog>
</template>

<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import ProDialog from '@/components/pro/dialogs/ProDialog.vue';
import {tierPrice} from '@/utils/proKeys';
import {money} from '@/utils/proFormat';

const props = defineProps({
  keyItem: {
    type: Object,
    required: true,
  },
  kind: {
    type: String,
    required: true,
  },
  forecastSum: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['close', 'confirm']);

const {t} = useI18n();

const text = computed(() => (props.kind === 'del'
  ? t('pro.dialogs.confirm.deleteText', {user: props.keyItem.user})
  : t('pro.dialogs.confirm.deactivateText', {user: props.keyItem.user})));

const note = computed(() => {
  if (props.kind === 'del') return t('pro.dialogs.confirm.deleteNote');
  if (props.keyItem.tier === 'free') return t('pro.dialogs.confirm.freeNote');
  return t('pro.dialogs.confirm.paidNote', {
    from: money(props.forecastSum),
    to: money(props.forecastSum - tierPrice(props.keyItem.tier)),
  });
});
</script>
