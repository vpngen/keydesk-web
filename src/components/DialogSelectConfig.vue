<template>
  <div class="dialog-select-config">
    <div class="popup__overlay" @click="$emit('close')"></div>
    <div class="dialog-select-config__content">
      <div class="dialog-select-config__header">
        <h3 class="dialog-select-config__title">{{ t('cabinet.dialogSelectConfig.title') }}</h3>
        <button class="dialog-select-config__close" @click="$emit('close')">
          <SvgIcon name="icon-close"/>
        </button>
      </div>
      <div class="dialog-select-config__options">
        <div class="dialog-select-config__card dialog-select-config__card--basic" @click="$emit('select', 'basic')">
          <div class="dialog-select-config__card-header">
            <h4 class="dialog-select-config__card-title">{{ t('cabinet.dialogSelectConfig.basicTitle') }}</h4>
          </div>
          <div class="dialog-select-config__card-price">
            <span class="dialog-select-config__card-price-text">{{ t('cabinet.dialogSelectConfig.free') }}</span>
          </div>
          <button class="dialog-select-config__card-button dialog-select-config__card-button--basic">
            {{ t('cabinet.dialogSelectConfig.choose') }}
          </button>
        </div>

        <div class="dialog-select-config__card dialog-select-config__card--vip" @click="$emit('select', 'vip')">
          <div class="dialog-select-config__card-header">
            <h4 class="dialog-select-config__card-title">{{ t('cabinet.dialogSelectConfig.vipTitle') }}</h4>
          </div>
          <div class="dialog-select-config__card-features">
            <p>{{ t('cabinet.dialogSelectConfig.vipF1') }}</p>
            <p>{{ t('cabinet.dialogSelectConfig.vipF2') }}</p>
            <p>{{ t('cabinet.dialogSelectConfig.vipF3') }}</p>
          </div>
          <div class="dialog-select-config__card-price">
            <span class="dialog-select-config__card-price-text">€4</span>
          </div>
          <button class="dialog-select-config__card-button dialog-select-config__card-button--vip">
            {{ t('cabinet.dialogSelectConfig.choose') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const emit = defineEmits(['close', 'select']);
</script>

