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
      <!-- Временно скрыто: покупка ключей идёт напрямую с карты, инвойсы вернутся,
           когда покупки переедут в них. Страница /invoices сохранена.
      <RouterLink
        :class="{'pro-header__nav-item--active': route.name === 'ProInvoices'}"
        :to="{path: '/invoices', query: route.query}"
        class="pro-header__nav-item"
      >
        {{ t('pro.nav.invoices') }}
      </RouterLink>
      -->
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
      <button class="pro-header__nav-item pro-header__nav-item--button" data-tour="nav-tour" type="button" @click="emit('open-tour')">
        {{ t('pro.nav.howItWorks') }}
      </button>
      <!-- Скрыто: в PRO-дизайне нет страницы уведомлений, а /notifications
           открывается в обычной теме. Вернём, когда появится PRO-версия страницы.
      <RouterLink
        :to="{path: '/notifications', query: route.query}"
        class="pro-header__nav-item pro-header__nav-item--right"
      >
        {{ t('pro.nav.notifications') }}
      </RouterLink>
      -->
    </nav>
  </div>
</template>

<script setup>
import {RouterLink, useRoute} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {persistLocale} from '@/i18n';

const emit = defineEmits(['open-tour']);

const {locale, t} = useI18n();
const route = useRoute();

const setLocale = (code) => {
  locale.value = code;
  persistLocale(code);
};
</script>
