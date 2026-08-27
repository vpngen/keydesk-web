<template>
  <div class="pro-page">
    <RouterLink :to="{path: '/', query: route.query}" class="pro-page__back">
      ← {{ t('pro.nav.backToKeys') }}
    </RouterLink>

    <div class="pro-page__header">
      <div class="pro-page__header-main">
        <div class="pro-page__eyebrow">{{ t('pro.help.subtitle') }}</div>
        <h1 class="pro-page__title">{{ t('pro.help.title') }}</h1>
      </div>
      <div class="pro-help__tabs">
        <button
          v-for="tab in TABS"
          :key="tab"
          :class="{'pro-help__tab--active': activeTab === tab}"
          class="pro-help__tab"
          type="button"
          @click="activeTab = tab"
        >
          {{ t(`pro.help.tabs.${tab}`) }}
        </button>
      </div>
    </div>

    <ProHelpGuides v-if="activeTab === 'guides'"/>
    <ProHelpFaq v-else-if="activeTab === 'faq'"/>
    <ProHelpSupport v-else/>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {RouterLink, useRoute} from 'vue-router';
import {useI18n} from 'vue-i18n';
import ProHelpGuides from '@/components/pro/help/ProHelpGuides.vue';
import ProHelpFaq from '@/components/pro/help/ProHelpFaq.vue';
import ProHelpSupport from '@/components/pro/help/ProHelpSupport.vue';

const TABS = ['guides', 'faq', 'support'];

const {t} = useI18n();
const route = useRoute();

const activeTab = ref('guides');
</script>
