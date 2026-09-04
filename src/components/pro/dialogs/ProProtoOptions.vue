<template>
  <div class="pro-dialog__body">
    <div class="pro-dialog__question">{{ t('pro.dialogs.create.protoQuestion') }}</div>
    <div
      v-for="proto in PRO_PROTOCOLS"
      :key="proto"
      :class="{'pro-option--active': modelValue === proto}"
      class="pro-option"
      @click="emit('update:modelValue', proto)"
    >
      <div class="pro-option__dot"></div>
      <div class="pro-option__main">
        <div class="pro-option__head">
          <div class="pro-option__name">{{ t(`pro.protocols.${proto}`) }}</div>
          <div class="pro-option__kind">{{ t('pro.dialogs.create.protoKind') }}</div>
        </div>
        <div class="pro-option__desc">{{ t(`pro.dialogs.create.protoDesc.${proto}`) }}</div>
        <div class="pro-option__sample">{{ PROTO_SAMPLES[proto] }}</div>
      </div>
    </div>
    <div class="pro-dialog__info">{{ t('pro.dialogs.create.protoNote') }}</div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import {PRO_PROTOCOLS} from '@/assets/constants/proConstants';

const PROTO_SAMPLES = {
  vless: 'vless://9f4a-4c11-b7e2@node-sever.vpn.gen:443?security=reality',
  outline: 'ss://Y2hhY2hhMjA6MWEyYg@node-sever.vpn.gen:8388',
  gate19: 'gate19://8f2c@node-sever.vpn.gen:4433',
};

defineProps({
  modelValue: {
    type: [String, null],
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const {t} = useI18n();
</script>
