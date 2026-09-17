<template>
  <ProDialog
    :cancel-label="phase === 'done' ? t('pro.dialogs.upgrade.backToKeys') : ''"
    :has-back="phase === 'confirm' && !busy"
    :has-cancel="phase === 'done' && fromFree"
    :primary-disabled="busy"
    :primary-label="primaryLabel"
    :primary-variant="phase === 'confirm' && immediateCharges ? 'red' : 'ink'"
    :title="`${t('pro.dialogs.upgrade.title')} · ${keyItem.name || keyItem.user}`"
    @back="goBack"
    @close="emit('close')"
    @primary="onPrimary"
  >
    <!-- 1 · тариф: Unlim предвыбран и подсвечен, Basic - альтернатива -->
    <div v-if="phase === 'pick'" class="pro-dialog__body">
      <div class="pro-dialog__key-row">
        <div class="pro-dialog__key-row-label">{{ t('pro.dialogs.upgrade.key') }}</div>
        <div class="pro-dialog__key-row-value">{{ keyLine }}</div>
      </div>
      <div class="pro-dialog__question">{{ t('pro.dialogs.upgrade.typeQuestion') }}</div>
      <ProTierCards v-model="tariff" :recommended="tiers.length > 1 ? 'unlim' : ''" :tiers="tiers" radio/>
      <!-- Предупреждение о перевыпуске - до перехода к оплате -->
      <div v-if="fromFree" class="pro-dialog__reissue">
        <div class="pro-dialog__reissue-mark">!</div>
        <div class="pro-dialog__reissue-text">
          <div class="pro-dialog__reissue-title">{{ t('pro.dialogs.upgrade.reissueTitle') }}</div>
          <div>{{ t('pro.dialogs.upgrade.reissueText') }}</div>
        </div>
      </div>
      <div v-if="!immediateCharges" class="pro-dialog__info">{{ t('pro.dialogs.upgrade.invoiceNote', {date: nextInvoiceDate}) }}</div>
    </div>

    <!-- 2 · подтверждение тарифа и списания -->
    <div v-else-if="phase === 'confirm'" class="pro-dialog__body">
      <div class="pro-dialog__headline">{{ t('pro.dialogs.upgrade.confirmPlan', {plan: planName, price: money(quote.price)}) }}</div>
      <div class="pro-dialog__key-row">
        <div class="pro-dialog__key-row-label">{{ t('pro.dialogs.upgrade.key') }}</div>
        <div class="pro-dialog__key-row-value">{{ keyLabel }}</div>
      </div>
      <template v-if="fromFree">
        <div v-if="immediateCharges" class="pro-dialog__lead">{{ t('pro.dialogs.upgrade.confirmCharge', {amount}) }}</div>
        <div v-else class="pro-dialog__lead">{{ t('pro.dialogs.upgrade.confirmInvoice', {plan: planName, date: nextInvoiceDate}) }}</div>
      </template>
      <template v-else>
        <div class="pro-dialog__lead">{{ t('pro.dialogs.upgrade.current', {plan: currentName}) }}</div>
        <template v-if="immediateCharges">
          <div v-if="quote.credit > 0" class="pro-dialog__question">
            {{ t('pro.dialogs.upgrade.credit', {plan: currentName, amount: money(quote.credit), days: quote.daysLeft, total: quote.periodDays}) }}
          </div>
          <div class="pro-dialog__headline">{{ t('pro.dialogs.upgrade.dueNow', {amount}) }}</div>
          <div class="pro-dialog__question">{{ t('pro.dialogs.upgrade.chargeText') }}</div>
        </template>
        <div v-else class="pro-dialog__info">{{ t('pro.dialogs.upgrade.invoiceNote', {date: nextInvoiceDate}) }}</div>
      </template>
      <div v-if="payFailed" class="pro-dialog__danger">{{ t('pro.dialogs.upgrade.payFailed') }}</div>
      <div v-if="busy" class="pro-dialog__foot-note">{{ t('pro.dialogs.create.charging', {price: amount}) }}</div>
    </div>

    <!-- 3 · готово: новый доступ, который нужно отправить пользователю -->
    <div v-else class="pro-dialog__body">
      <div class="pro-dialog__headline">{{ t('pro.dialogs.upgrade.doneReissued', {plan: planName}) }}</div>
      <template v-if="fromFree">
        <div class="pro-dialog__lead">{{ t('pro.dialogs.upgrade.doneReissuedText') }}</div>
        <div class="pro-dialog__field-label">{{ t('pro.dialogs.upgrade.newAccess') }}</div>
        <div class="pro-done__key">
          <div class="pro-done__key-value">{{ newAccess || t('pro.dialogs.upgrade.noNewAccess') }}</div>
        </div>
      </template>
      <div v-else class="pro-dialog__lead">{{ t('pro.dialogs.upgrade.doneSwitched', {plan: planName}) }}</div>
    </div>
  </ProDialog>
</template>

<script setup>
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import ProDialog from '@/components/pro/dialogs/ProDialog.vue';
import ProTierCards from '@/components/pro/dialogs/ProTierCards.vue';
import {useProKeysStore} from '@/store/proKeys';
import {useProBillingStore} from '@/store/proBilling';
import {useProToastStore} from '@/store/proToast';
import {upgradeTiers, upgradeQuote, accessString, availableProtos} from '@/utils/proKeys';
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
const {keysList, protoByKey} = storeToRefs(proKeysStore);
const {immediateCharges, nextInvoiceAt} = storeToRefs(billingStore);
const nextInvoiceDate = computed(() => (nextInvoiceAt.value ? formatDate(new Date(nextInvoiceAt.value)) : ''));

// pick → confirm → done
const phase = ref('pick');
const busy = ref(false);
const payFailed = ref(false);

// Free → Basic/Unlim: ключ перевыпускается, пользователю нужен новый доступ.
const fromFree = computed(() => props.keyItem.tier === 'free');

// Только тарифы выше текущего; Unlim - по умолчанию.
const tiers = computed(() => upgradeTiers(props.keyItem));
const tariff = ref(tiers.value.includes('unlim') ? 'unlim' : tiers.value[0]);

const planName = computed(() => t(`pro.tiers.${tariff.value}.name`));
const currentName = computed(() => t(`pro.tiers.${props.keyItem.tier}.name`));
// Название пользователя первым, системный псевдоним - следом.
const keyLabel = computed(() => (props.keyItem.name ? `${props.keyItem.name} · ${props.keyItem.user}` : props.keyItem.user));
const keyLine = computed(() => `${keyLabel.value} · ${currentName.value}`);
// Сумма списания = цена нового тарифа минус зачёт за неиспользованные дни
// текущего (считается на фронте, временно - до реального биллинга).
const quote = computed(() => upgradeQuote(props.keyItem, tariff.value));
const amount = computed(() => money(quote.value.due));

// Актуальный ключ после смены тарифа (стор перечитывает его с бэкенда).
const freshKey = computed(() => keysList.value.find((k) => k.id === props.keyItem.id) || props.keyItem);

const newAccess = computed(() => {
  const key = freshKey.value;
  const protos = availableProtos(key);
  let proto = protoByKey.value[key.id] || key.proto;
  if (protos && protos.length && !protos.includes(proto)) [proto] = protos;
  return accessString(key, proto, 'link') || accessString(key, proto, 'key') || '';
});

const primaryLabel = computed(() => {
  if (phase.value === 'pick') return t('pro.dialogs.upgrade.continueWith', {plan: planName.value});
  if (phase.value === 'confirm') {
    if (payFailed.value) return t('pro.dialogs.create.retry');
    if (fromFree.value) {
      return immediateCharges.value
        ? t('pro.dialogs.upgrade.payReissue', {amount: amount.value})
        : t('pro.dialogs.upgrade.reissueButton');
    }
    return immediateCharges.value
      ? t('pro.dialogs.upgrade.payButton', {amount: amount.value})
      : t('pro.dialogs.upgrade.switchButton');
  }
  return fromFree.value ? t('pro.dialogs.upgrade.copyNewLink') : t('pro.dialogs.common.done');
});

const pay = async () => {
  busy.value = true;
  payFailed.value = false;
  try {
    await proKeysStore.purchaseTier(props.keyItem.id, tariff.value, immediateCharges.value ? quote.value.due : null);
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

const keyRef = computed(() => (props.keyItem.name
  ? t('pro.toasts.keyRef', {name: props.keyItem.name, user: props.keyItem.user})
  : props.keyItem.user));

const copyNewLink = async () => {
  if (!newAccess.value) {
    toastStore.show(t('pro.toasts.noStoredKey'));
    return;
  }
  try {
    await navigator.clipboard.writeText(newAccess.value);
  } catch {
    /* клипборд недоступен (http/permissions) - тост все равно показываем */
  }
  toastStore.show(t('pro.toasts.copiedLink', {user: keyRef.value}));
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
  if (fromFree.value) {
    copyNewLink();
    return;
  }
  emit('close');
};

const goBack = () => {
  payFailed.value = false;
  phase.value = 'pick';
};
</script>
