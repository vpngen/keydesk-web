<template>
  <div class="pro-term">
    <div class="pro-term__options">
      <button
        v-for="months in TERM_MONTHS"
        :key="months"
        :class="{'pro-term__option--active': modelValue === months}"
        class="pro-term__option"
        type="button"
        @click="emit('update:modelValue', months)"
      >
        {{ prefix }}{{ months }} {{ t('pro.dialogs.common.monthsShort') }}
      </button>
    </div>
    <div v-if="untilDate" class="pro-term__until">
      <div class="pro-term__until-label">{{ t('pro.dialogs.create.termUntil') }}</div>
      <div class="pro-term__until-value">{{ untilDate }}</div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import {TERM_MONTHS} from '@/assets/constants/proConstants';

defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  untilDate: {
    type: String,
    default: '',
  },
  prefix: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const {t} = useI18n();
</script>
