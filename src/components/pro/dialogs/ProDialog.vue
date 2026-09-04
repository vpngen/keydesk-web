<template>
  <div class="pro-dialog">
    <div :style="{maxWidth: `${maxWidth}px`}" class="pro-dialog__window">
      <div class="pro-dialog__head">
        <div class="pro-dialog__title">{{ title }}</div>
        <button class="pro-dialog__close" type="button" @click="emit('close')">✕</button>
      </div>

      <div v-if="steps.length" class="pro-dialog__steps">
        <div
          v-for="(s, i) in steps"
          :key="i"
          :class="`pro-dialog__step--${s.state}`"
          class="pro-dialog__step"
        >
          {{ s.label }}
        </div>
      </div>

      <slot/>

      <div class="pro-dialog__foot">
        <div class="pro-dialog__foot-left">
          <button v-if="hasBack" class="pro-dialog__back" type="button" @click="emit('back')">
            {{ t('pro.dialogs.common.back') }}
          </button>
          <button v-if="hasSkip" class="pro-dialog__skip" type="button" @click="emit('skip')">
            {{ t('pro.dialogs.common.skip') }}
          </button>
          <div v-if="stepHint" class="pro-dialog__step-hint">{{ stepHint }}</div>
        </div>
        <div class="pro-dialog__foot-right">
          <button v-if="hasCancel" class="pro-dialog__cancel" type="button" @click="emit('close')">
            {{ cancelLabel || t('pro.dialogs.common.cancel') }}
          </button>
          <button
            :class="[`pro-dialog__primary--${primaryVariant}`, {'pro-dialog__primary--disabled': primaryDisabled}]"
            :disabled="primaryDisabled"
            class="pro-dialog__primary"
            type="button"
            @click="emit('primary')"
          >
            {{ primaryLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

defineProps({
  title: {
    type: String,
    required: true,
  },
  steps: {
    type: Array,
    default: () => [],
  },
  stepHint: {
    type: String,
    default: '',
  },
  primaryLabel: {
    type: String,
    required: true,
  },
  primaryVariant: {
    type: String,
    default: 'ink',
  },
  primaryDisabled: {type: Boolean},
  hasBack: {type: Boolean},
  hasSkip: {type: Boolean},
  hasCancel: {
    type: Boolean,
    default: true,
  },
  cancelLabel: {
    type: String,
    default: '',
  },
  maxWidth: {
    type: Number,
    default: 640,
  },
});

const emit = defineEmits(['close', 'back', 'skip', 'primary']);

const {t} = useI18n();
</script>
