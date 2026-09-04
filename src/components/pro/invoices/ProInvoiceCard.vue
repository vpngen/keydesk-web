<template>
  <div :class="[`pro-invoice-card--${invoice.tone}`, {'pro-invoice-card--alt': invoice.alt}]" class="pro-invoice-card">
    <div class="pro-invoice-card__head">
      <div class="pro-invoice-card__num">№ {{ invoice.num }}</div>
      <span :class="`pro-invoice-card__badge--${invoice.status}`" class="pro-invoice-card__badge">
        {{ t(`pro.invoices.statuses.${invoice.status}`) }}
      </span>
    </div>
    <div class="pro-invoice-card__fields">
      <div class="pro-invoice-card__field">
        <div class="pro-invoice-card__field-label">{{ t('pro.invoices.period') }}</div>
        <div class="pro-invoice-card__field-value">{{ invoice.period }}</div>
      </div>
      <div class="pro-invoice-card__field">
        <div class="pro-invoice-card__field-label">{{ t('pro.invoices.keys') }}</div>
        <div class="pro-invoice-card__field-value">{{ invoice.keys }}</div>
      </div>
      <div class="pro-invoice-card__field">
        <div class="pro-invoice-card__field-label">{{ t('pro.invoices.created') }}</div>
        <div class="pro-invoice-card__field-value">{{ invoice.created }}</div>
      </div>
      <div class="pro-invoice-card__field">
        <div class="pro-invoice-card__field-label">{{ t('pro.invoices.paidAt') }}</div>
        <div class="pro-invoice-card__field-value">{{ invoice.paidAt }}</div>
      </div>
    </div>
    <div class="pro-invoice-card__foot">
      <div :class="{'pro-invoice-card__sum--danger': invoice.sumDanger}" class="pro-invoice-card__sum">{{ invoice.sum }}</div>
      <div class="pro-invoice-card__actions">
        <button class="pro-invoice-card__open" type="button" @click="emit('open', invoice)">
          {{ t('pro.invoices.open') }}
        </button>
        <button v-if="invoice.payable" class="pro-invoice-card__pay" type="button" @click="emit('pay')">
          {{ t('pro.invoices.pay') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

defineProps({
  invoice: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['open', 'pay']);

const {t} = useI18n();
</script>
