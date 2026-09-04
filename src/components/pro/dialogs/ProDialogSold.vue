<template>
  <ProDialog
    :max-width="560"
    :primary-label="t('pro.dialogs.common.save')"
    :title="t('pro.dialogs.sold.title')"
    @close="emit('close')"
    @primary="emit('save', soldNum)"
  >
    <div class="pro-dialog__body">
      <div class="pro-dialog__key-row">
        <div class="pro-dialog__key-row-label">{{ t('pro.dialogs.sold.keyLabel') }}</div>
        <div class="pro-dialog__key-row-value">{{ keyLabel }}</div>
      </div>
      <div class="pro-dialog__question">{{ t('pro.dialogs.sold.hint') }}</div>
      <div class="pro-dialog__sold-row pro-dialog__sold-row--large">
        <div class="pro-dialog__sold-euro">€</div>
        <input
          v-model="text"
          class="pro-dialog__sold-input"
          placeholder="0"
          type="text"
          @input="text = text.replace(/[^0-9.,]/g, '').slice(0, PRO_LIMITS.sold)"
        >
        <div class="pro-dialog__sold-per">{{ t('pro.dialogs.create.soldPer') }}</div>
      </div>
      <div class="pro-dialog__calc">
        <div class="pro-dialog__calc-line">
          <div>{{ t('pro.dialogs.sold.cost') }}</div>
          <div class="pro-dialog__calc-value">{{ costText }}</div>
        </div>
        <div class="pro-dialog__calc-total">
          <div class="pro-dialog__calc-total-label">{{ t('pro.dialogs.sold.profit') }}</div>
          <div :class="`pro-dialog__calc-profit--${profitTone}`" class="pro-dialog__calc-profit">{{ profitText }}</div>
        </div>
      </div>
      <div class="pro-dialog__foot-note">{{ t('pro.dialogs.sold.foot') }}</div>
    </div>
  </ProDialog>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import ProDialog from '@/components/pro/dialogs/ProDialog.vue';
import {PRO_LIMITS} from '@/assets/constants/proConstants';
import {tierPrice} from '@/utils/proKeys';
import {money} from '@/utils/proFormat';

const props = defineProps({
  keyItem: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'save']);

const {t} = useI18n();

const text = ref(props.keyItem.sold ? String(props.keyItem.sold) : '');

const keyLabel = computed(() => props.keyItem.user + (props.keyItem.name ? ` · ${props.keyItem.name}` : ''));
const soldNum = computed(() => Math.max(0, parseFloat(String(text.value).replace(',', '.')) || 0));
const cost = computed(() => tierPrice(props.keyItem.tier));

const costText = computed(() => (props.keyItem.tier === 'free'
  ? `${t('pro.tiers.free.name')} · ${money(0)}`
  : `${money(cost.value)} ${t('pro.dialogs.review.perMonth')}`));

const profitText = computed(() => {
  const profit = soldNum.value - cost.value;
  return `${profit > 0 ? '+' : ''}${money(profit)}`;
});

const profitTone = computed(() => {
  const profit = soldNum.value - cost.value;
  if (profit > 0) return 'pos';
  if (profit < 0) return 'neg';
  return 'zero';
});
</script>
