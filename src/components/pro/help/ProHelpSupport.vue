<template>
  <div class="pro-help__support">
    <div class="pro-help__support-card">
      <div class="pro-help__support-head">{{ t('pro.help.support.title') }}</div>
      <div class="pro-help__support-body">
        <div class="pro-help__support-intro">{{ t('pro.help.support.intro') }}</div>
        <div class="pro-help__support-rows">
          <div v-for="row in rows" :key="row.label" class="pro-help__support-row">
            <div class="pro-help__support-row-label">{{ row.label }}</div>
            <div class="pro-help__support-row-value">{{ row.value }}</div>
          </div>
        </div>
        <button class="pro-help__support-cta" type="button" @click="openSupport">
          {{ t('pro.help.support.cta') }}
        </button>
      </div>
    </div>
    <div class="pro-help__support-card pro-help__support-card--tips">
      <div class="pro-help__support-head">{{ t('pro.help.support.beforeTitle') }}</div>
      <div class="pro-help__support-body">
        <div v-for="n in 2" :key="n" class="pro-help__support-tip">
          <div class="pro-help__support-tip-dot"></div>
          <div class="pro-help__support-tip-text">{{ t(`pro.help.support.tip${n}`) }}</div>
        </div>
        <div class="pro-help__support-warning">{{ t('pro.help.support.warning') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useProToastStore} from '@/store/proToast';
import {useProfileStore} from '@/store/profile';

const SUPPORT_BOT = '@vpngen_support';
const SUPPORT_MAIL = 'vpngenerator@vpn.support';

const {t} = useI18n();
const toastStore = useProToastStore();
const profileStore = useProfileStore();
const {uuid} = storeToRefs(profileStore);

const rows = computed(() => [
  {label: t('pro.help.support.bot'), value: SUPPORT_BOT},
  {label: t('pro.help.support.mail'), value: SUPPORT_MAIL},
  {label: t('pro.help.support.account'), value: uuid.value ? `#${uuid.value.replace(/-/g, '').slice(0, 6)}` : '#112233'},
]);

const openSupport = () => {
  toastStore.show(t('pro.toasts.supportChat', {bot: SUPPORT_BOT}));
};
</script>
