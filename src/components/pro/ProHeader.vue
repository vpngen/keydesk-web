<template>
  <div class="pro-header">
    <div class="pro-header__brand">
      <div class="pro-header__brand-left">
        <div class="pro-header__wordmark">
          <span class="pro-header__wordmark-accent">VPN</span><span>.GENERATOR</span>
        </div>
        <div class="pro-header__stamp">PRO</div>
      </div>
      <div class="pro-header__brand-right">
        <div class="pro-header__lang">
          <button
            :class="{'pro-header__lang-btn--active': locale === 'ru'}"
            class="pro-header__lang-btn"
            type="button"
            @click="setLocale('ru')"
          >
            {{ t('cabinet.lang.ru') }}
          </button>
          <span class="pro-header__lang-separator">|</span>
          <button
            :class="{'pro-header__lang-btn--active': locale === 'en'}"
            class="pro-header__lang-btn"
            type="button"
            @click="setLocale('en')"
          >
            {{ t('cabinet.lang.en') }}
          </button>
        </div>
        <div v-if="initials" class="pro-header__avatar">{{ initials }}</div>
      </div>
    </div>
    <nav class="pro-header__nav">
      <RouterLink
        :class="{'pro-header__nav-item--active': route.name === 'Home'}"
        :to="{path: '/', query: route.query}"
        class="pro-header__nav-item"
      >
        {{ t('pro.nav.connections') }}
      </RouterLink>
      <RouterLink
        :class="{'pro-header__nav-item--active': route.name === 'ProInvoices'}"
        :to="{path: '/invoices', query: route.query}"
        class="pro-header__nav-item"
      >
        {{ t('pro.nav.invoices') }}
      </RouterLink>
      <RouterLink
        :class="{'pro-header__nav-item--active': route.name === 'ProAnalytics'}"
        :to="{path: '/analytics', query: route.query}"
        class="pro-header__nav-item"
      >
        {{ t('pro.nav.analytics') }}
      </RouterLink>
      <RouterLink
        :class="{'pro-header__nav-item--active': route.name === 'ProHelp'}"
        :to="{path: '/help', query: route.query}"
        class="pro-header__nav-item"
      >
        {{ t('pro.nav.help') }}
      </RouterLink>
      <button class="pro-header__nav-item pro-header__nav-item--button" type="button" @click="emit('open-tour')">
        {{ t('pro.nav.howItWorks') }}
      </button>
      <RouterLink
        :to="{path: '/notifications', query: route.query}"
        class="pro-header__nav-item pro-header__nav-item--right"
      >
        {{ t('pro.nav.notifications') }}
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {RouterLink, useRoute} from 'vue-router';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {persistLocale} from '@/i18n';
import {useProKeysStore} from '@/store/proKeys';

const emit = defineEmits(['open-tour']);

const {locale, t} = useI18n();
const route = useRoute();
const proKeysStore = useProKeysStore();
const {brigadierName} = storeToRefs(proKeysStore);

const initials = computed(() => {
  const parts = brigadierName.value.trim().split(/\s+/).filter((p) => /^\p{L}/u.test(p));
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join('');
});

const setLocale = (code) => {
  locale.value = code;
  persistLocale(code);
};
</script>
