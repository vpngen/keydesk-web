<template>
  <div class="popup popup--welcome">
    <div class="popup__overlay welcome"/>
    <div class="popup__alert welcome-congrats">
      <div class="popup__icon-welcome-congrats"/>
      <div class="popup__title welcome-congrats">
        {{ t('cabinet.welcome.step7.title') }}
      </div>
      <div class="popup__text">
        {{ t('cabinet.welcome.step7.subscribe') }}<br><a href="https://t.me/vpngen" target="_blank" rel="noopener noreferrer">{{ t('cabinet.welcome.step7.channelLink') }}</a>
      </div>
      <div class="popup__text">{{ t('cabinet.welcome.step7.support') }}<br>
        <a href="https://t.me/vgsup_bot" target="_blank" rel="noopener noreferrer">{{ t('cabinet.welcome.step7.supportLink') }}</a></div>
      <div class="popup__button welcome">
        <button class="button button--welcome" type="button" @click="emit('close')">{{ t('cabinet.welcome.step7.done') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const emit = defineEmits(['close']);

</script>
