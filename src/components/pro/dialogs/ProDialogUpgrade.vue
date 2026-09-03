<template>
  <ProDialog
    :has-back="step > 1 && step <= 3"
    :has-cancel="step < 4"
    :primary-label="primaryLabel"
    :step-hint="step <= 3 ? t('pro.dialogs.common.stepOf', {step, total: 3}) : ''"
    :steps="steps"
    :title="`${t('pro.dialogs.upgrade.title')} · ${keyItem.user}`"
    @back="step -= 1"
    @close="emit('close')"
    @primary="onPrimary"
  >
    <ProTierOptions
      v-if="step === 1"
      v-model="tariff"
      :question="t('pro.dialogs.upgrade.typeQuestion')"
      :tiers="['basic', 'unlim']"
    />

    <div v-else-if="step === 2" class="pro-dialog__body">
      <div class="pro-dialog__question">{{ t('pro.dialogs.upgrade.termQuestion', {tier: t(`pro.tiers.${tariff}.name`)}) }}</div>
      <ProTermPicker v-model="months" :until-date="untilDate"/>
      <div class="pro-dialog__info">{{ t('pro.dialogs.create.termNote') }}</div>
    </div>

    <ProReviewPanel
      v-else-if="step === 3"
      :forecast-after="money(forecastSum + tierPrice(tariff) + prorate(tariff))"
      :forecast-now="money(forecastSum)"
      :monthly-price="`${money(tierPrice(tariff))} ${t('pro.dialogs.review.perMonth')}`"
      :next-invoice-date="nextInvoiceDate"
      :prorate-days="daysToBilling()"
      :prorate-sum="money(prorate(tariff))"
      :rows="reviewRows"
    />

    <ProDonePanel
      v-else
      :key-value="doneKey"
      :note="doneNote"
      :stamp="t('pro.dialogs.upgrade.doneStamp')"
      :sub="doneSub"
      :title="t('pro.dialogs.upgrade.doneTitle', {tier: t(`pro.tiers.${tariff}.name`)})"
    />
  </ProDialog>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import ProDialog from '@/components/pro/dialogs/ProDialog.vue';
import ProTierOptions from '@/components/pro/dialogs/ProTierOptions.vue';
import ProTermPicker from '@/components/pro/dialogs/ProTermPicker.vue';
import ProReviewPanel from '@/components/pro/dialogs/ProReviewPanel.vue';
import ProDonePanel from '@/components/pro/dialogs/ProDonePanel.vue';
import {tierPrice, prorate, accessString} from '@/utils/proKeys';
import {money, addMonths, formatIso, formatDate, nextBilling, daysToBilling} from '@/utils/proFormat';

const props = defineProps({
  keyItem: {
    type: Object,
    required: true,
  },
  forecastSum: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['close', 'upgrade']);

const {t} = useI18n();

const step = ref(1);
const tariff = ref('unlim');
const months = ref(6);

const untilDate = computed(() => formatIso(addMonths(null, months.value)));
const nextInvoiceDate = computed(() => formatDate(nextBilling()));

const STEP_KEYS = ['tariff', 'term', 'review'];

const steps = computed(() => {
  if (step.value > 3) return [];
  return STEP_KEYS.map((key, i) => {
    const idx = i + 1;
    const label = `${idx} · ${t(`pro.dialogs.upgrade.steps.${key}`)}`;
    return {
      label: idx < step.value ? `${idx} ✓` : label,
      state: idx === step.value ? 'current' : idx < step.value ? 'done' : 'todo',
    };
  });
});

const primaryLabel = computed(() => {
  if (step.value === 3) return t('pro.dialogs.upgrade.submit');
  if (step.value === 4) return t('pro.dialogs.common.done');
  return t('pro.dialogs.common.next');
});

const reviewRows = computed(() => [
  {label: t('pro.dialogs.upgrade.key'), value: props.keyItem.user},
  {label: t('pro.dialogs.review.name'), value: props.keyItem.name || t('pro.card.unnamed')},
  {label: t('pro.dialogs.upgrade.was'), value: t(`pro.tiers.${props.keyItem.tier}.name`)},
  {label: t('pro.dialogs.upgrade.becomes'), value: t('pro.dialogs.upgrade.becomesValue', {tier: t(`pro.tiers.${tariff.value}.name`), date: untilDate.value})},
]);

const doneKey = computed(() => accessString(props.keyItem, props.keyItem.proto, 'link') || '');

const doneSub = computed(() => `${props.keyItem.user} · ${t('pro.dialogs.done.until', {date: untilDate.value})} · ${t('pro.dialogs.upgrade.reissued')}`);

const doneNote = computed(() => t('pro.dialogs.upgrade.doneNote', {
  prorate: money(prorate(tariff.value)),
  date: nextInvoiceDate.value,
}));

const onPrimary = () => {
  if (step.value === 3) {
    emit('upgrade', {tier: tariff.value, months: months.value});
    step.value = 4;
    return;
  }
  if (step.value === 4) {
    emit('close');
    return;
  }
  step.value += 1;
};
</script>
