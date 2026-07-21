<template>
  <div class="profile__message">
    <div class="profile__message-icon">
      <SvgIcon name="icon-status-deactive"/>
    </div>
    <div class="profile__message-text">
      {{ t('cabinet.profile.warningMessage') }}
    </div>
    <div class="profile__message-close" @click="$emit('close')">
      <SvgIcon name="icon-close"/>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import SvgIcon from '@/components/SvgIcon.vue';

defineEmits(['close']);

const {t} = useI18n();
</script>
