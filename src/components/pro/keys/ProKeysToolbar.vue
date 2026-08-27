<template>
  <div class="pro-toolbar">
    <div class="pro-toolbar__search">
      <span class="pro-toolbar__search-icon">⌕</span>
      <input
        v-model="filterText"
        :placeholder="t('pro.toolbar.searchPlaceholder')"
        class="pro-toolbar__search-input"
        type="text"
      >
      <button v-if="filterText" class="pro-toolbar__search-clear" type="button" @click="filterText = ''">✕</button>
    </div>
    <select v-model="selectedTier" class="pro-toolbar__select">
      <option value="all">{{ t('pro.toolbar.tierAll') }}</option>
      <option value="free">{{ t('pro.toolbar.tierPrefix') }}{{ t('pro.tiers.free.name') }}</option>
      <option value="basic">{{ t('pro.toolbar.tierPrefix') }}{{ t('pro.tiers.basic.name') }}</option>
      <option value="unlim">{{ t('pro.toolbar.tierPrefix') }}{{ t('pro.tiers.unlim.name') }}</option>
    </select>
    <select v-model="selectedStatus" class="pro-toolbar__select">
      <option value="all">{{ t('pro.toolbar.statusAll') }}</option>
      <option value="ok">{{ t('pro.status.ok') }}</option>
      <option value="warn">{{ t('pro.status.warn') }}</option>
      <option value="blocked">{{ t('pro.status.blocked') }}</option>
      <option value="idle">{{ t('pro.status.idle') }}</option>
      <option value="off">{{ t('pro.status.off') }}</option>
    </select>
    <select v-model="selectedSort" class="pro-toolbar__select">
      <option value="until">{{ t('pro.toolbar.sortUntil') }}</option>
      <option value="last">{{ t('pro.toolbar.sortLast') }}</option>
      <option value="name">{{ t('pro.toolbar.sortName') }}</option>
      <option value="traffic">{{ t('pro.toolbar.sortTraffic') }}</option>
    </select>
    <div class="pro-toolbar__view">
      <button
        :class="{'pro-toolbar__view-btn--active': view === 'cards'}"
        class="pro-toolbar__view-btn"
        type="button"
        @click="view = 'cards'"
      >
        <SvgIcon name="pro-view-cards"/> {{ t('pro.toolbar.cards') }}
      </button>
      <button
        :class="{'pro-toolbar__view-btn--active': view === 'table'}"
        class="pro-toolbar__view-btn pro-toolbar__view-btn--bordered"
        type="button"
        @click="view = 'table'"
      >
        <SvgIcon name="pro-view-table"/> {{ t('pro.toolbar.table') }}
      </button>
    </div>
    <button class="pro-toolbar__create" type="button" @click="emit('create')">
      + {{ t('pro.toolbar.newKey') }}
    </button>
  </div>
</template>

<script setup>
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import SvgIcon from '@/components/SvgIcon.vue';
import {useProKeysFilterStore} from '@/store/proKeysFilter';

const emit = defineEmits(['create']);

const {t} = useI18n();
const filterStore = useProKeysFilterStore();
const {filterText, selectedTier, selectedStatus, selectedSort, view} = storeToRefs(filterStore);
</script>
