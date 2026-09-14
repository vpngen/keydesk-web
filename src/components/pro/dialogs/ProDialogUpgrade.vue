<template>
  <ProDialog
    :has-back="phase === 'confirm' && !busy"
    :has-cancel="phase !== 'done'"
    :primary-disabled="busy"
    :primary-label="primaryLabel"
    :primary-variant="phase === 'confirm' ? 'red' : 'ink'"
    :title="`${t('pro.dialogs.upgrade.title')} · ${keyItem.user}`"
    @back="goBack"
    @close="emit('close')"
    @primary="onPrimary"
  >
    <!-- 1 · тариф -->
    <ProTierOptions
      v-if="phase === 'pick'"
      v-model="tariff"
      :question="t('pro.dialogs.upgrade.typeQuestion')"
      :tiers="tiers"
    />

    <!-- 2 · подтверждение и списание: сумма списывается сразу, тариф
         активируется только после успешной оплаты -->
    <div v-else-if="phase === 'confirm'" class="pro-dialog__body">
      <div class="pro-dialog__headline">{{ t('pro.dialogs.upgrade.switchTo', {plan: planName}) }}</div>
      <div class="pro-dialog__key-row">
        <div class="pro-dialog__key-row-label">{{ t('pro.dialogs.upgrade.key') }}</div>
        <div class="pro-dialog__key-row-value">{{ keyLabel }}</div>
      </div>
      <div class="pro-dialog__lead">{{ t('pro.dialogs.upgrade.current', {plan: currentName}) }}</div>
      <div class="pro-dialog__headline">{{ t('pro.dialogs.upgrade.dueNow', {amount}) }}</div>
      <div class="pro-dialog__question">{{ t('pro.dialogs.upgrade.chargeText') }}</div>
      <div v-if="nextChargeDate" class="pro-dialog__question">{{ t('pro.dialogs.upgrade.nextCharge', {date: nextChargeDate}) }}</div>
      <div v-if="payFailed" class="pro-dialog__danger">{{ t('pro.dialogs.upgrade.payFailed') }}</div>
      <div v-if="busy" class="pro-dialog__foot-note">{{ t('pro.dialogs.create.charging', {price: amount}) }}</div>
    </div>

    <!-- 3 · оплата прошла -->
    <div v-else class="pro-dialog__body">
      <div class="pro-dialog__headline">{{ t('pro.dialogs.upgrade.successTitle') }}</div>
      <div class="pro-dialog__lead">{{ t('pro.dialogs.upgrade.successText', {plan: planName}) }}</div>
    </div>
  </ProDialog>
</template>

<script setup>
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import ProDialog from '@/components/pro/dialogs/ProDialog.vue';
import ProTierOptions from '@/components/pro/dialogs/ProTierOptions.vue';
import {useProKeysStore} from '@/store/proKeys';
import {useProBillingStore} from '@/store/proBilling';
import {useProToastStore} from '@/store/proToast';
import {PRO_INVOICES_ENABLED} from '@/assets/constants/proConstants';
import {tierPrice} from '@/utils/proKeys';
import {money, formatDate} from '@/utils/proFormat';

const props = defineProps({
  keyItem: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'upgraded']);

const {t} = useI18n();
const proKeysStore = useProKeysStore();
const billingStore = useProBillingStore();
const toastStore = useProToastStore();
const {currentInvoice} = storeToRefs(billingStore);

// pick → confirm → done
const phase = ref('pick');
const busy = ref(false);
const payFailed = ref(false);

// Текущий тариф из списка убираем - «переход» на него не имеет смысла.
const tiers = computed(() => ['basic', 'unlim'].filter((tier) => tier !== props.keyItem.tier));
const tariff = ref(tiers.value.includes('unlim') ? 'unlim' : tiers.value[0]);

const planName = computed(() => t(`pro.tiers.${tariff.value}.name`));
const currentName = computed(() => t(`pro.tiers.${props.keyItem.tier}.name`));
const keyLabel = computed(() => (props.keyItem.name ? `${props.keyItem.user} · ${props.keyItem.name}` : props.keyItem.user));
// Сумма списания = месячная цена тарифа (её же списывает стаб оплаты).
const amount = computed(() => money(tierPrice(tariff.value)));
// Дату следующего списания берём только из биллинга; пока инвойсов нет - не показываем.
const nextChargeDate = computed(() => (PRO_INVOICES_ENABLED && currentInvoice.value?.dueAt
  ? formatDate(new Date(currentInvoice.value.dueAt))
  : null));

const primaryLabel = computed(() => {
  if (phase.value === 'pick') return t('pro.dialogs.common.next');
  if (phase.value === 'confirm') {
    return payFailed.value ? t('pro.dialogs.create.retry') : t('pro.dialogs.upgrade.payButton', {amount: amount.value});
  }
  return t('pro.dialogs.common.done');
});

const pay = async () => {
  busy.value = true;
  payFailed.value = false;
  try {
    await proKeysStore.purchaseTier(props.keyItem.id, tariff.value);
    phase.value = 'done';
    emit('upgraded', tariff.value);
  } catch (error) {
    if (error?.code === 'payment_failed') {
      payFailed.value = true;
    } else {
      console.error(error);
      toastStore.show(t('pro.toasts.saveFailed'));
    }
  } finally {
    busy.value = false;
  }
};

const onPrimary = () => {
  if (busy.value) return;
  if (phase.value === 'pick') {
    phase.value = 'confirm';
    return;
  }
  if (phase.value === 'confirm') {
    pay();
    return;
  }
  emit('close');
};

const goBack = () => {
  payFailed.value = false;
  phase.value = 'pick';
};
</script>
