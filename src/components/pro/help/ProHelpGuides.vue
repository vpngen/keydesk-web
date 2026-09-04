<template>
  <div class="pro-help__guides">
    <div class="pro-dialog__info">{{ t('pro.help.guidesIntro') }}</div>

    <div class="pro-help__filters">
      <div class="pro-help__filter-group">
        <div class="pro-help__filter-label">{{ t('pro.help.filterDevices') }}</div>
        <div class="pro-help__chips">
          <button
            v-for="device in DEVICES"
            :key="device"
            :class="{'pro-help__chip--active': deviceFilter === device}"
            class="pro-help__chip"
            type="button"
            @click="deviceFilter = deviceFilter === device ? null : device"
          >
            {{ device }} <span class="pro-help__chip-arrow">→</span>
          </button>
        </div>
      </div>
      <div class="pro-help__filter-group">
        <div class="pro-help__filter-label">{{ t('pro.help.filterProtos') }}</div>
        <div class="pro-help__chips">
          <button
            v-for="proto in PRO_PROTOCOLS"
            :key="proto"
            :class="{'pro-help__chip--active': protoFilter === proto}"
            class="pro-help__chip"
            type="button"
            @click="protoFilter = protoFilter === proto ? null : proto"
          >
            {{ t(`pro.protocols.${proto}`) }} <span class="pro-help__chip-arrow">→</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="deviceFilter || protoFilter" class="pro-help__filter-state">
      <div>{{ t('pro.help.shownOf', {shown: guides.length, total: GUIDES.length}) }}</div>
      <button class="pro-help__filter-clear" type="button" @click="clearFilter">
        {{ t('pro.help.clearFilter') }}
      </button>
    </div>

    <div v-if="!guides.length" class="pro-help__no-guides">{{ t('pro.help.noGuides') }}</div>

    <div class="pro-help__guides-grid">
      <div v-for="guide in guides" :key="guide.id" class="pro-guide-card">
        <div class="pro-guide-card__head">
          <div class="pro-guide-card__os">{{ t(`pro.help.guides.${guide.id}.os`) }}</div>
          <div class="pro-guide-card__app">{{ t(`pro.help.guides.${guide.id}.app`) }}</div>
        </div>
        <div class="pro-guide-card__steps">
          <div v-for="n in guide.steps" :key="n" class="pro-guide-card__step">
            <div class="pro-guide-card__step-num">{{ n }}</div>
            <div class="pro-guide-card__step-text">{{ t(`pro.help.guides.${guide.id}.s${n}`) }}</div>
          </div>
        </div>
        <div class="pro-guide-card__foot">
          <div class="pro-guide-card__proto">{{ t(`pro.help.guides.${guide.id}.proto`) }}</div>
          <button class="pro-guide-card__more" type="button" @click="toastStore.show(t('pro.toasts.guideSoon'))">
            {{ t('pro.help.more') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useProToastStore} from '@/store/proToast';
import {PRO_PROTOCOLS} from '@/assets/constants/proConstants';

const DEVICES = ['Windows', 'macOS', 'iOS', 'Android'];

// Метаданные гайдов (фильтры); тексты — в i18n pro.help.guides.iN.*
const GUIDES = [
  {id: 'i1', devs: ['iOS'], proto: 'vless', steps: 3},
  {id: 'i2', devs: ['Android'], proto: 'vless', steps: 3},
  {id: 'i3', devs: ['Windows'], proto: 'vless', steps: 3},
  {id: 'i4', devs: ['iOS', 'Android'], proto: 'outline', steps: 3},
  {id: 'i5', devs: ['macOS'], proto: 'vless', steps: 3},
  {id: 'i6', devs: ['iOS'], proto: 'gate19', steps: 3},
];

const {t} = useI18n();
const toastStore = useProToastStore();

const deviceFilter = ref(null);
const protoFilter = ref(null);

const guides = computed(() => GUIDES.filter((g) => {
  if (deviceFilter.value && !g.devs.includes(deviceFilter.value)) return false;
  if (protoFilter.value && g.proto !== protoFilter.value) return false;
  return true;
}));

const clearFilter = () => {
  deviceFilter.value = null;
  protoFilter.value = null;
};
</script>
