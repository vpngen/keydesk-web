<template>
  <div class="pro-dialog__body">
    <div class="pro-dialog__question">{{ question }}</div>
    <div
      v-for="tier in tiers"
      :key="tier"
      :class="{'pro-option--active': modelValue === tier}"
      class="pro-option"
      @click="emit('update:modelValue', tier)"
    >
      <div class="pro-option__dot"></div>
      <div class="pro-option__main">
        <div class="pro-option__head">
          <div class="pro-option__name">{{ t(`pro.tiers.${tier}.name`) }}</div>
          <div class="pro-option__price">{{ t(`pro.tiers.${tier}.price`) }}</div>
        </div>
        <div class="pro-option__desc">{{ t(`pro.tiers.${tier}.desc`) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

defineProps({
  modelValue: {
    type: [String, null],
    default: null,
  },
  tiers: {
    type: Array,
    default: () => ['free', 'basic', 'unlim'],
  },
  question: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const {t} = useI18n();
</script>
