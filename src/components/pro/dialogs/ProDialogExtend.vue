<template>
  <ProDialog
    :primary-label="t('pro.dialogs.extend.submit', {date: nextDate})"
    :title="`${t('pro.dialogs.extend.title')} · ${keyItem.user}`"
    @close="emit('close')"
    @primary="emit('extend', {months})"
  >
    <div class="pro-dialog__body">
      <div class="pro-extend__dates">
        <div class="pro-extend__date">
          <div class="pro-extend__date-label">{{ t('pro.dialogs.extend.now') }}</div>
          <div :class="{'pro-extend__date-value--warn': isWarn}" class="pro-extend__date-value">{{ nowDate }}</div>
        </div>
        <div class="pro-extend__arrow">→</div>
        <div class="pro-extend__date">
          <div class="pro-extend__date-label">{{ t('pro.dialogs.extend.next') }}</div>
          <div class="pro-extend__date-value pro-extend__date-value--strong">{{ nextDate }}</div>
        </div>
        <div class="pro-extend__spacer"></div>
        <div class="pro-extend__tariff">{{ t(`pro.tiers.${keyItem.tier}.name`) }}</div>
      </div>

      <ProTermPicker v-model="months" prefix="+"/>

      <div class="pro-extend__invoice">
        <div class="pro-extend__invoice-line">
          <div>{{ t('pro.dialogs.extend.currentInvoice') }}</div>
          <div class="pro-extend__invoice-value pro-extend__invoice-value--faded">{{ t('pro.dialogs.extend.unchanged') }}</div>
        </div>
        <div class="pro-extend__invoice-line">
          <div>{{ t('pro.dialogs.review.invoiceAt', {date: nextInvoiceDate}) }}</div>
          <div class="pro-extend__invoice-value">{{ deltaText }}</div>
        </div>
        <div class="pro-extend__invoice-total">
          <div class="pro-extend__invoice-total-label">{{ t('pro.dialogs.extend.chargeNow') }}</div>
          <div class="pro-extend__invoice-total-value">{{ t('pro.dialogs.extend.notNeeded') }}</div>
        </div>
      </div>
      <div class="pro-dialog__foot-note">{{ t('pro.dialogs.extend.note') }}</div>
    </div>
  </ProDialog>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import ProDialog from '@/components/pro/dialogs/ProDialog.vue';
import ProTermPicker from '@/components/pro/dialogs/ProTermPicker.vue';
import {tierPrice, countsIn} from '@/utils/proKeys';
import {money, addMonths, formatIso, formatDate, nextBilling, daysUntil} from '@/utils/proFormat';

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

const emit = defineEmits(['close', 'extend']);

const {t} = useI18n();

const months = ref(3);

const nowDate = computed(() => formatIso(props.keyItem.until) || t('pro.card.termless'));
const nextDate = computed(() => formatIso(addMonths(props.keyItem.until, months.value)));
const nextInvoiceDate = computed(() => formatDate(nextBilling()));
const isWarn = computed(() => Boolean(props.keyItem.until) && daysUntil(props.keyItem.until) <= 7);

const deltaText = computed(() => (countsIn(props.keyItem)
  ? `${t('pro.dialogs.extend.unchanged')} · ${money(props.forecastSum)}`
  : `+${money(tierPrice(props.keyItem.tier))} → ${money(props.forecastSum + tierPrice(props.keyItem.tier))}`));
</script>
