<template>
  <div class="pro-help__support">
    <div class="pro-help__support-card">
      <div class="pro-help__support-head">{{ t('pro.help.support.title') }}</div>
      <div class="pro-help__support-body">
        <div class="pro-help__support-intro">{{ t('pro.help.support.intro') }}</div>
        <div class="pro-help__support-rows">
          <div v-for="row in rows" :key="row.label" class="pro-help__support-row">
            <div class="pro-help__support-row-label">{{ row.label }}</div>
            <div class="pro-help__support-row-value">
              <a :href="row.href" class="pro-help__support-link" rel="noopener" target="_blank">{{ row.value }}</a>
            </div>
          </div>
        </div>
        <a :href="SUPPORT_BOT_URL" class="pro-help__support-cta" rel="noopener" target="_blank">
          {{ t('pro.help.support.cta') }}
        </a>
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
import {useI18n} from 'vue-i18n';

const SUPPORT_BOT = '@vpngen_support';
const SUPPORT_BOT_URL = 'https://t.me/vpngen_support';
const SUPPORT_MAIL = 'vpngenerator@vpn.support';

const {t} = useI18n();

// Контакты - живые ссылки; «номер счёта» убран: он путался с инвойсом.
const rows = computed(() => [
  {label: t('pro.help.support.bot'), value: SUPPORT_BOT, href: SUPPORT_BOT_URL},
  {label: t('pro.help.support.mail'), value: SUPPORT_MAIL, href: `mailto:${SUPPORT_MAIL}`},
]);
</script>
