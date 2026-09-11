<template>
  <ProDialog
    :has-back="phase === 'confirm' && !busy"
    :has-cancel="false"
    :primary-disabled="primaryDisabled"
    :primary-label="primaryLabel"
    :primary-variant="phase === 'confirm' ? 'red' : 'ink'"
    :title="title"
    @back="goBack"
    @close="emit('close')"
    @primary="onPrimary"
  >
    <!-- 1 · какой ключ продаем -->
    <div v-if="phase === 'pick'" class="pro-dialog__body">
      <div class="pro-dialog__question">{{ t('pro.dialogs.create.typeQuestion') }}</div>
      <ProTierCards v-model="tier"/>
      <div v-if="busy" class="pro-dialog__foot-note">{{ t('pro.dialogs.create.creatingFree') }}</div>
    </div>

    <!-- 2 · подтверждение списания (только платные) -->
    <div v-else-if="phase === 'confirm'" class="pro-dialog__body">
      <div class="pro-dialog__headline">{{ t('pro.dialogs.create.confirmTitle') }}</div>
      <div class="pro-dialog__lead">{{ t('pro.dialogs.create.confirmLead', {price: priceText, tier: tierName}) }}</div>
      <div class="pro-dialog__question">{{ t('pro.dialogs.create.confirmText') }}</div>
      <div v-if="payFailed" class="pro-dialog__danger">{{ t('pro.dialogs.create.payFailed') }}</div>
      <div v-if="busy" class="pro-dialog__foot-note">{{ t('pro.dialogs.create.charging', {price: priceText}) }}</div>
      <div v-else class="pro-dialog__question pro-dialog__question--strong">{{ t('pro.dialogs.create.confirmQuestion') }}</div>
    </div>

    <!-- 3 · ключ готов: название и комментарий -->
    <div v-else-if="phase === 'name'" class="pro-dialog__body">
      <div class="pro-dialog__headline">{{ t('pro.dialogs.create.readyTitle') }}</div>
      <div class="pro-dialog__lead">{{ t('pro.dialogs.create.readyLead') }}</div>

      <div class="pro-dialog__field-label">{{ t('pro.dialogs.create.nameLabel') }}</div>
      <div class="pro-dialog__input-box">
        <input
          v-model="name"
          :maxlength="PRO_LIMITS.name"
          :placeholder="t('pro.dialogs.create.namePlaceholder')"
          class="pro-dialog__input"
          type="text"
        >
        <div class="pro-dialog__counter">{{ name.length }} / {{ PRO_LIMITS.name }}</div>
      </div>

      <div class="pro-dialog__field-label">{{ t('pro.dialogs.create.noteLabelOpt') }}</div>
      <div class="pro-dialog__input-box pro-dialog__input-box--soft">
        <textarea
          v-model="note"
          :maxlength="PRO_LIMITS.note"
          :placeholder="t('pro.dialogs.create.notePlaceholder')"
          class="pro-dialog__textarea"
          rows="3"
        ></textarea>
        <div class="pro-dialog__counter">{{ note.length }} / {{ PRO_LIMITS.note }}</div>
      </div>
      <div class="pro-dialog__warning">{{ t('pro.dialogs.create.piiJoke') }}</div>
    </div>

    <!-- 4 · готов к продаже -->
    <div v-else class="pro-dialog__body">
      <div class="pro-dialog__headline">{{ t('pro.dialogs.create.soldTitle', {name: savedName}) }}</div>
      <div class="pro-dialog__lead">{{ t('pro.dialogs.create.soldLead') }}</div>
    </div>
  </ProDialog>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import ProDialog from '@/components/pro/dialogs/ProDialog.vue';
import ProTierCards from '@/components/pro/dialogs/ProTierCards.vue';
import {useProKeysStore} from '@/store/proKeys';
import {useProToastStore} from '@/store/proToast';
import {PRO_LIMITS} from '@/assets/constants/proConstants';
import {tierPrice} from '@/utils/proKeys';
import {money} from '@/utils/proFormat';

const emit = defineEmits(['close', 'goto']);

const {t} = useI18n();
const proKeysStore = useProKeysStore();
const toastStore = useProToastStore();

// pick → (confirm, только платные) → name → ready
const phase = ref('pick');
const tier = ref('basic'); // по умолчанию — PRO Basic
const busy = ref(false);
const payFailed = ref(false);
const createdKey = ref(null);
const name = ref('');
const note = ref('');
const savedName = ref('');

const tierName = computed(() => t(`pro.tiers.${tier.value}.name`));
const priceText = computed(() => money(tierPrice(tier.value)));

const title = computed(() => (phase.value === 'pick'
  ? t('pro.dialogs.create.title')
  : `${t('pro.dialogs.create.title')} · ${tierName.value}`));

const primaryLabel = computed(() => {
  if (phase.value === 'pick') return tier.value === 'free' ? t('pro.dialogs.create.submitFree') : t('pro.dialogs.common.next');
  if (phase.value === 'confirm') return payFailed.value ? t('pro.dialogs.create.retry') : t('pro.dialogs.create.confirmYes');
  if (phase.value === 'name') return t('pro.dialogs.create.saveName');
  return t('pro.dialogs.create.gotoKey');
});

const primaryDisabled = computed(() => busy.value || (phase.value === 'name' && !name.value.trim()));

// Списание (для платных) + создание ключа. Платный ключ = месячное списание,
// поэтому срок — 1 месяц; при отказе оплаты ключ не создаётся.
const purchase = async () => {
  busy.value = true;
  payFailed.value = false;
  try {
    createdKey.value = await proKeysStore.purchaseKey({
      tier: tier.value,
      proto: 'vless',
      months: 1,
      name: '',
      note: '',
      sold: 0,
    });
    toastStore.show(t('pro.toasts.created'));
    phase.value = 'name';
  } catch (error) {
    if (error?.code === 'payment_failed') {
      payFailed.value = true;
    } else {
      console.error(error);
      toastStore.show(t('pro.toasts.createFailed'));
    }
  } finally {
    busy.value = false;
  }
};

const save = async () => {
  busy.value = true;
  try {
    await proKeysStore.patchKeyMeta(createdKey.value.id, {name: name.value.trim(), note: note.value.trim()});
    savedName.value = name.value.trim();
    phase.value = 'ready';
  } catch (error) {
    console.error(error);
    toastStore.show(t('pro.toasts.saveFailed'));
  } finally {
    busy.value = false;
  }
};

const onPrimary = () => {
  if (busy.value) return;
  if (phase.value === 'pick') {
    if (tier.value === 'free') {
      purchase();
    } else {
      phase.value = 'confirm';
    }
    return;
  }
  if (phase.value === 'confirm') {
    purchase();
    return;
  }
  if (phase.value === 'name') {
    save();
    return;
  }
  emit('goto', createdKey.value);
};

const goBack = () => {
  payFailed.value = false;
  phase.value = 'pick';
};
</script>
