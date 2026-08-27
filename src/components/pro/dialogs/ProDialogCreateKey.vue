<template>
  <ProDialog
    :has-back="step > 1 && step <= 5"
    :has-cancel="step < 6"
    :has-skip="step === 4"
    :primary-disabled="primaryDisabled"
    :primary-label="primaryLabel"
    :step-hint="step <= 5 ? t('pro.dialogs.common.stepOf', {step, total: stepLabels.length}) : ''"
    :steps="steps"
    :title="title"
    @back="step -= 1"
    @close="emit('close')"
    @primary="onPrimary"
    @skip="onSkip"
  >
    <ProTierOptions
      v-if="step === 1"
      v-model="tariff"
      :question="t('pro.dialogs.create.typeQuestion')"
    />

    <ProProtoOptions v-else-if="step === 2" v-model="proto"/>

    <div v-else-if="step === 3" class="pro-dialog__body">
      <div class="pro-dialog__question">
        {{ tariff === 'free' ? t('pro.dialogs.create.termFree') : t('pro.dialogs.create.termQuestion') }}
      </div>
      <template v-if="tariff !== 'free'">
        <ProTermPicker v-model="months" :until-date="untilDate"/>
        <div class="pro-dialog__info">{{ t('pro.dialogs.create.termNote') }}</div>
      </template>
    </div>

    <div v-else-if="step === 4" class="pro-dialog__body">
      <div class="pro-dialog__question">{{ t('pro.dialogs.create.nameHint') }}</div>
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
      <div class="pro-dialog__warning">{{ t('pro.dialogs.common.piiWarning') }}</div>
      <div class="pro-dialog__foot-note">{{ t('pro.dialogs.create.nameFoot') }}</div>

      <div class="pro-dialog__extra">
        <div class="pro-dialog__extra-label">{{ t('pro.dialogs.create.noteLabel') }}</div>
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
        <div class="pro-dialog__warning">{{ t('pro.dialogs.common.piiWarningShort') }}</div>
        <div class="pro-dialog__foot-note">{{ t('pro.dialogs.create.noteFoot') }}</div>
      </div>

      <div v-if="tariff !== 'free'" class="pro-dialog__extra">
        <div class="pro-dialog__extra-label">{{ t('pro.dialogs.create.soldLabel') }}</div>
        <div class="pro-dialog__foot-note">{{ t('pro.dialogs.create.soldHint') }}</div>
        <div class="pro-dialog__sold-row">
          <div class="pro-dialog__sold-euro">€</div>
          <input
            v-model="sold"
            class="pro-dialog__sold-input"
            placeholder="0"
            type="text"
            @input="sold = sold.replace(/[^0-9.,]/g, '').slice(0, PRO_LIMITS.sold)"
          >
          <div class="pro-dialog__sold-per">{{ t('pro.dialogs.create.soldPer') }}</div>
          <div class="pro-dialog__sold-spacer"></div>
          <div :class="`pro-dialog__sold-profit--${createProfitTone}`" class="pro-dialog__sold-profit">
            {{ t('pro.card.profit').toLowerCase() }} {{ createProfitText }}
          </div>
        </div>
      </div>
    </div>

    <ProReviewPanel
      v-else-if="step === 5"
      :forecast-after="money(forecastSum + tierPrice(tariff) + prorate(tariff))"
      :forecast-now="money(forecastSum)"
      :monthly-price="`${money(tierPrice(tariff))} ${t('pro.dialogs.review.perMonth')}`"
      :next-invoice-date="nextInvoiceDate"
      :prorate-days="daysToBilling()"
      :prorate-sum="money(prorate(tariff))"
      :rows="reviewRows"
    />

    <ProDonePanel
      v-else-if="step === 6 && createdKey"
      :key-value="doneKey"
      :note="doneNote"
      :stamp="t('pro.dialogs.create.doneStamp')"
      :sub="doneSub"
      :title="t('pro.dialogs.create.doneTitle')"
    />
  </ProDialog>
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import ProDialog from '@/components/pro/dialogs/ProDialog.vue';
import ProTierOptions from '@/components/pro/dialogs/ProTierOptions.vue';
import ProProtoOptions from '@/components/pro/dialogs/ProProtoOptions.vue';
import ProTermPicker from '@/components/pro/dialogs/ProTermPicker.vue';
import ProReviewPanel from '@/components/pro/dialogs/ProReviewPanel.vue';
import ProDonePanel from '@/components/pro/dialogs/ProDonePanel.vue';
import {PRO_LIMITS} from '@/assets/constants/proConstants';
import {tierPrice, prorate, keyString} from '@/utils/proKeys';
import {money, addMonths, formatIso, formatDate, nextBilling, daysToBilling} from '@/utils/proFormat';

const props = defineProps({
  forecastSum: {
    type: Number,
    required: true,
  },
  createdKey: {
    type: [Object, null],
    default: null,
  },
});

const emit = defineEmits(['close', 'create']);

const {t} = useI18n();

const step = ref(1);
const tariff = ref(null);
const proto = ref('vless');
const months = ref(3);
const name = ref('');
const note = ref('');
const sold = ref('');

const soldNum = computed(() => Math.max(0, parseFloat(String(sold.value).replace(',', '.')) || 0));
const untilDate = computed(() => formatIso(addMonths(null, months.value)));
const nextInvoiceDate = computed(() => formatDate(nextBilling()));

const stepLabels = computed(() => {
  const labels = ['type', 'proto', 'term', 'name'];
  if (tariff.value !== 'free') labels.push('review');
  return labels;
});

const steps = computed(() => {
  if (step.value > 5) return [];
  return stepLabels.value.map((key, i) => {
    const idx = i + 1;
    const label = `${idx} · ${t(`pro.dialogs.create.steps.${key}`)}`;
    return {
      label: idx < step.value ? `${idx} ✓` : label,
      state: idx === step.value ? 'current' : idx < step.value ? 'done' : 'todo',
    };
  });
});

const title = computed(() => (tariff.value
  ? `${t('pro.dialogs.create.title')} · ${t(`pro.tiers.${tariff.value}.name`)}`
  : t('pro.dialogs.create.title')));

const primaryDisabled = computed(() => (step.value === 1 && !tariff.value) || (step.value === 2 && !proto.value));

const primaryLabel = computed(() => {
  if (step.value === 1 && !tariff.value) return t('pro.dialogs.create.pickTariff');
  if (step.value === 2 && !proto.value) return t('pro.dialogs.create.pickProto');
  if (step.value === 5) return t('pro.dialogs.create.submit');
  if (step.value === 6) return t('pro.dialogs.create.toKeys');
  return t('pro.dialogs.common.next');
});

const createProfitText = computed(() => {
  const profit = soldNum.value - tierPrice(tariff.value);
  return `${profit > 0 ? '+' : ''}${money(profit)}`;
});

const createProfitTone = computed(() => {
  const profit = soldNum.value - tierPrice(tariff.value);
  if (profit > 0) return 'pos';
  if (profit < 0) return 'neg';
  return 'zero';
});

const reviewRows = computed(() => [
  {label: t('pro.dialogs.review.tariff'), value: `${t(`pro.tiers.${tariff.value}.name`)} · ${money(tierPrice(tariff.value))}${t('pro.card.perMonth')}`},
  {label: t('pro.dialogs.review.proto'), value: `${t(`pro.protocols.${proto.value}`)} · ${t('pro.dialogs.create.protoKind')}`},
  {label: t('pro.dialogs.review.term'), value: t('pro.dialogs.review.termValue', {months: months.value, date: untilDate.value})},
  {label: t('pro.dialogs.review.name'), value: name.value || t('pro.card.unnamed')},
  {label: t('pro.dialogs.review.note'), value: note.value ? t('pro.dialogs.review.noteYes') : t('pro.dialogs.review.noteNo')},
  {
    label: t('pro.card.soldFor'),
    value: soldNum.value
      ? t('pro.dialogs.review.soldValue', {sum: money(soldNum.value), profit: money(soldNum.value - tierPrice(tariff.value))})
      : t('pro.dialogs.review.soldNo'),
  },
]);

const doneKey = computed(() => (props.createdKey ? keyString(props.createdKey, proto.value, 'link') : ''));

const doneSub = computed(() => {
  if (!props.createdKey) return '';
  const until = tariff.value === 'free' ? t('pro.card.termless') : untilDate.value;
  return `${props.createdKey.user} · ${t(`pro.tiers.${tariff.value}.name`)} · ${t('pro.dialogs.done.until', {date: until})} · ${name.value || t('pro.card.unnamed')}`;
});

const doneNote = computed(() => {
  if (tariff.value === 'free') return t('pro.dialogs.create.doneNoteFree');
  return t('pro.dialogs.create.doneNotePaid', {
    date: nextInvoiceDate.value,
    sum: money(props.forecastSum + prorate(tariff.value)),
    prorate: money(prorate(tariff.value)),
  });
});

const submit = () => {
  emit('create', {
    tier: tariff.value,
    proto: proto.value,
    months: months.value,
    name: name.value.trim(),
    note: note.value.trim(),
    sold: soldNum.value,
  });
};

const onPrimary = () => {
  if (step.value === 6) {
    emit('close');
    return;
  }
  if (step.value === 4 && tariff.value === 'free') {
    submit();
    return;
  }
  if (step.value === 5) {
    submit();
    return;
  }
  step.value += 1;
};

const onSkip = () => {
  name.value = '';
  note.value = '';
  sold.value = '';
  if (tariff.value === 'free') {
    submit();
    return;
  }
  step.value = 5;
};

watch(() => props.createdKey, (created) => {
  if (created) {
    step.value = 6;
  }
});
</script>
