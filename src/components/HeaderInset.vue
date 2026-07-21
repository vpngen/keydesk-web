<template>
  <header class="header header--inset">
    <div class="header__container">
      <RouterLink class="header__logo" :to="{ path: '/', query: route.query }">
        <SvgIcon name="logo-vpn"/>
      </RouterLink>
      <div class="header__right">
        <RouterLink :class="`header__notifications ${message.length ? 'header__notifications--message' : ''}`"
                    :data-total="message.length" :to="{ path: '/notifications', query: route.query }">
          <SvgIcon name="icon-ring"/>
        </RouterLink>
        <HeaderMessage v-if="showMessage" :message="message" @toggle="toggleMessage"/>
        <div class="header__lang">
          <button
            :class="{ 'header__lang-btn--active': locale === 'ru' }"
            class="header__lang-btn"
            type="button"
            @click="setLocale('ru')"
          >
            {{ t('cabinet.lang.ru') }}
          </button>
          <span class="header__lang-separator">|</span>
          <button
            :class="{ 'header__lang-btn--active': locale === 'en' }"
            class="header__lang-btn"
            type="button"
            @click="setLocale('en')"
          >
            {{ t('cabinet.lang.en') }}
          </button>
        </div>
        <div v-if="token && !isVIP" class="header__vip">
          <button class="header__vip-button" type="button" @click="getVipFromLink">
            <span>VIP</span><span>-</span><span>{{ t('cabinet.header.vipSquad') }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
  <div v-if="token && isVIP" class="vip-banner">
    <span class="vip-banner__label">
      {{ t('cabinet.header.vipBanner') }}
    </span>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {RouterLink, useRoute} from 'vue-router'
import axios from "axios";
import SvgIcon from './SvgIcon.vue';
import HeaderMessage from "@/components/HeaderMessage.vue";
import {useAuthStore} from "@/store/auth";
import {useUsersStore} from "@/store/users";
import {useProfileStore} from "@/store/profile";
import {storeToRefs} from 'pinia';
import {apiLink} from "@/const/api";
import {useI18n} from 'vue-i18n'
import {persistLocale} from '@/i18n'
import {isConstructionError} from '@/utils/apiErrors';

const {locale, t} = useI18n()
const route = useRoute();
const authStore = useAuthStore();
const usersStore = useUsersStore();
const profileStore = useProfileStore();
const {token} = storeToRefs(authStore);
const {usersList} = storeToRefs(usersStore);
const {isVIP, uuid} = storeToRefs(profileStore);

const message = ref([]);
const showMessage = ref(false);

const setLocale = (code) => {
  locale.value = code
  persistLocale(code)
}

const getMessage = async () => {
  await axios.get(`${apiLink}/messages?read=false&priority=10&priority-op=eq`)
    .then((r) => {
      message.value = r.data.messages;

      if (message.value.length) {
        showMessage.value = !showMessage.value;
      }
    });
};

const getVipFromLink = () => {
  window.open(`https://t.me/vpngeneratorbot?start=${uuid.value}`, '_blank');
};

const toggleMessage = async () => {
  if (showMessage.value) {
    await axios.post(`${apiLink}/messages/${message.value[0].id}/read`);

    await getMessage();
  }

  showMessage.value = !showMessage.value;
};

onMounted(async () => {
  try {
    await authStore.fetchToken();
    await getMessage();
  } catch (error) {
    if (isConstructionError(error)) return;
    console.error(error);
  }
});
</script>
