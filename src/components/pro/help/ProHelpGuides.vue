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
        <div class="pro-help__filter-label">{{ t('pro.help.filterApps') }}</div>
        <div class="pro-help__chips">
          <button
            v-for="app in APPS"
            :key="app"
            :class="{'pro-help__chip--active': appFilter === app}"
            class="pro-help__chip"
            type="button"
            @click="appFilter = appFilter === app ? null : app"
          >
            {{ app }} <span class="pro-help__chip-arrow">→</span>
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

    <div v-if="hasFilter" class="pro-help__filter-state">
      <div>{{ t('pro.help.shownOf', {shown: guides.length, total: GUIDES.length}) }}</div>
      <button class="pro-help__filter-clear" type="button" @click="clearFilter">
        {{ t('pro.help.clearFilter') }}
      </button>
    </div>

    <!-- Нет инструкции под выбор: предлагаем доступные для того же устройства
         (или приложения), а если и их нет - поддержку. -->
    <div v-if="!guides.length" class="pro-help__no-guides">
      <div>{{ alternatives.length ? t('pro.help.noGuidesFor', {choice: choiceLabel}) : t('pro.help.noGuidesSupport') }}</div>
      <div v-if="alternatives.length" class="pro-help__alternatives">
        <a
          v-for="guide in alternatives"
          :key="guide.id"
          :href="guide.url"
          class="pro-help__alternative"
          rel="noopener"
          target="_blank"
        >
          {{ t(`pro.help.guides.${guide.id}.os`) }} · {{ guide.app }} → {{ t('pro.help.openGuide') }}
        </a>
      </div>
      <div v-else class="pro-help__alternatives">
        <a :href="SUPPORT_URL" class="pro-help__alternative" rel="noopener" target="_blank">{{ t('pro.help.support.cta') }}</a>
      </div>
    </div>

    <div class="pro-help__guides-grid">
      <div v-for="guide in guides" :key="guide.id" class="pro-guide-card">
        <div class="pro-guide-card__head">
          <div class="pro-guide-card__os">{{ t(`pro.help.guides.${guide.id}.os`) }}</div>
          <div class="pro-guide-card__app">{{ guide.app }}</div>
        </div>
        <div class="pro-guide-card__steps">
          <div v-for="n in 3" :key="n" class="pro-guide-card__step">
            <div class="pro-guide-card__step-num">{{ n }}</div>
            <div class="pro-guide-card__step-text">{{ t(`pro.help.guides.${guide.id}.s${n}`) }}</div>
          </div>
        </div>
        <div class="pro-guide-card__foot">
          <div class="pro-guide-card__proto">
            {{ t(`pro.help.guides.${guide.id}.proto`) }}<template v-if="guideLang"> · {{ guideLang }}</template>
          </div>
          <div class="pro-guide-card__links">
            <a v-if="guide.download" :href="guide.download" class="pro-guide-card__download" rel="noopener" target="_blank">
              {{ t('pro.help.download') }}
            </a>
            <a :href="guide.url" class="pro-guide-card__more" rel="noopener" target="_blank">
              {{ t('pro.help.more') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {PRO_PROTOCOLS} from '@/assets/constants/proConstants';

const SUPPORT_URL = 'https://t.me/vpngen_support';

const DEVICES = ['Windows', 'macOS', 'iOS', 'Android', 'Linux'];
// Приложения - отдельная ось: Gate 19 принимает и VLESS, и Outline; VPN Generator
// работает по ссылке на ключ.
const APPS = ['Hiddify', 'RabbitHole', 'Outline', 'Gate 19', 'VPN Generator'];

// Матрица инструкций: устройство × приложение × способ подключения. Ссылки -
// документы старой ключницы (на русском), проверены 15.09.2026. Тексты шагов -
// в i18n pro.help.guides.iN.*
const GUIDES = [
  {id: 'i1', devs: ['iOS'], app: 'RabbitHole', protos: ['vless'], url: 'https://bit.ly/VPNgeniOSH', download: 'https://apps.apple.com/ru/app/rabbithole-vpn-client/id6683309629'},
  {id: 'i2', devs: ['Android'], app: 'Hiddify', protos: ['vless'], url: 'https://docs.google.com/document/d/186oOAva4L93F8SWY8GZazvYxwDp-M5jvfPR4XzQ4v10/', download: 'https://play.google.com/store/apps/details?id=app.hiddify.com'},
  {id: 'i3', devs: ['Windows'], app: 'Hiddify', protos: ['vless', 'outline'], url: 'https://bit.ly/VPNgenWindowsH', download: 'https://hiddify.com/'},
  {id: 'i4', devs: DEVICES, app: 'Outline', protos: ['outline'], url: 'https://docs.google.com/document/d/1mrXZJo1AqXJeSjdZH5A6SAchmCMUmPzxosIzqZPJ95E/', download: 'https://getoutline.org/ru/get-started/#step-3'},
  {id: 'i5', devs: ['macOS'], app: 'Hiddify', protos: ['vless', 'outline'], url: 'https://bit.ly/VPNgenMacH', download: 'https://github.com/hiddify/hiddify-app/releases'},
  {id: 'i6', devs: ['iOS'], app: 'Gate 19', protos: ['vless', 'outline'], url: 'https://docs.google.com/document/d/1qsckChvNrce9G2fyI2NAghvD_beAPe4g5oNtB50KNgY/edit?usp=sharing', download: 'https://apps.apple.com/app/gate-19-guard/id6761811823'},
  {id: 'i7', devs: ['Android'], app: 'Gate 19', protos: ['vless', 'outline'], url: 'https://docs.google.com/document/d/1G_QQib5KVltfGLQJ5QYshwoSyZ_L4-iPtCAPAXHLUhY/edit?usp=sharing', download: 'https://play.google.com/store/apps/details?id=org.stayconnected.gate19'},
  {id: 'i8', devs: ['Linux'], app: 'Hiddify', protos: ['vless'], url: 'https://bit.ly/VPNgenLinuxH', download: 'https://github.com/hiddify/hiddify-app/releases'},
  {id: 'i9', devs: ['Android'], app: 'VPN Generator', protos: [], url: 'https://docs.google.com/document/d/14qRXMj7zqJu3s2aiOglM8dLiQUFav9FOrwfMOyFfiTY/', download: ''},
];

const {t} = useI18n();

const deviceFilter = ref(null);
const appFilter = ref(null);
const protoFilter = ref(null);

const hasFilter = computed(() => Boolean(deviceFilter.value || appFilter.value || protoFilter.value));

const matches = (g, {device, app, proto}) => {
  if (device && !g.devs.includes(device)) return false;
  if (app && g.app !== app) return false;
  if (proto && !g.protos.includes(proto)) return false;
  return true;
};

const guides = computed(() => GUIDES.filter((g) => matches(g, {device: deviceFilter.value, app: appFilter.value, proto: protoFilter.value})));

// Запасной вариант: то же устройство (в первую очередь), иначе то же приложение.
const alternatives = computed(() => {
  if (deviceFilter.value) return GUIDES.filter((g) => matches(g, {device: deviceFilter.value}));
  if (appFilter.value) return GUIDES.filter((g) => matches(g, {app: appFilter.value}));
  return GUIDES.filter((g) => matches(g, {proto: protoFilter.value}));
});

const choiceLabel = computed(() => deviceFilter.value || appFilter.value || (protoFilter.value ? t(`pro.protocols.${protoFilter.value}`) : ''));

// В английском интерфейсе помечаем, что инструкции на русском (RU - пусто).
const guideLang = computed(() => t('pro.help.guideLang'));

const clearFilter = () => {
  deviceFilter.value = null;
  appFilter.value = null;
  protoFilter.value = null;
};
</script>
