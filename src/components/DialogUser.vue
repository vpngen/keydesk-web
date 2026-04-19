<template>
  <div class="popup">
    <div class="popup__overlay" @click="close"/>
    <div class="popup__alert" data-alert="delete">
      <div class="popup__icon">
        <SvgIcon name="icon-alert"/>
      </div>
      <div class="popup__title">
        {{ t('cabinet.dialogUser.confirmDelete') }}
      </div>
      <div class="popup__buttons">
        <div class="popup__button">
          <button class="button button--close" @click="close">{{ t('cabinet.dialogUser.cancel') }}</button>
        </div>
        <div class="popup__button">
          <button class="button button--delete" @click="removeUser">{{ t('cabinet.dialogUser.delete') }}</button>
        </div>
      </div>
    </div>
    <div class="popup__alert is-hidden" data-alert="access">
      <div class="popup__icon">
        <SvgIcon name="icon-alert"/>
      </div>
      <div class="popup__title">
        {{ t('cabinet.dialogUser.torrentTitle') }}
      </div>
      <div class="popup__text">
        {{ t('cabinet.dialogUser.accessRestored') }}
      </div>
      <div class="popup__timer">
        10:00
      </div>
      <div class="popup__button">
        <button class="button button--ok" @click="close">{{ t('cabinet.dialogUser.ok') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  userId: {
    type: String
  }
});

const emit = defineEmits(['close', 'removeUser']);

const close = () => {
  emit('close');
};

const removeUser = () => {
  emit('removeUser', props.userId);
};

</script>
