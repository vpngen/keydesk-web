<template>
  <header class="header header--inset">
    <div class="header__container">
      <RouterLink class="header__logo" to="/">
        <SvgIcon name="logo-vpn"/>
      </RouterLink>
      <div class="header__right">
        <RouterLink :class="`header__notifications ${message.length ? 'header__notifications--message' : ''}`"
                    :data-total="message.length" to="/notifications">
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
          <button class="header__vip-button" @click="getVipFromLink">
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
import {ref} from 'vue'
import {RouterLink} from 'vue-router'
import axios from "axios";
import SvgIcon from './SvgIcon.vue';
import HeaderMessage from "@/components/HeaderMessage.vue";
import {useUsersStore} from "@/store/users";
import {useProfileStore} from "@/store/profile";
import {storeToRefs} from 'pinia';
import jwtDecode from 'jwt-decode'
import {apiLink} from "@/const/api";
import {useI18n} from 'vue-i18n'
import {persistLocale} from '@/i18n'

const {locale, t} = useI18n()

const setLocale = (code) => {
  locale.value = code
  persistLocale(code)
}

const usersStore = useUsersStore();
const profileStore = useProfileStore();
const {usersList} = storeToRefs(usersStore);
const {isVIP, urlVIP, uuid} = storeToRefs(profileStore);

const token = ref(null);
const message = ref([]);
const showMessage = ref(false);

const getToken = async () => {
  await axios.post(`${apiLink}/token`)
    .then((r) => {
      token.value = r.data.Token;
      const decoded = jwtDecode(token.value);
      isVIP.value = decoded.vip;
      urlVIP.value = decoded.vip_url;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;

      getMessage();
    });
};

const getMessage = async () => {
  await axios.get(`${apiLink}/messages?read=false&priority=10&priority-op=eq`)
    .then((r) => {
      message.value = r.data.messages;

      if (message.value.length) {
        showMessage.value = !showMessage.value;
      }
    });
};

getToken();

const getVipFromLink = () => {
  window.open(`https://t.me/vipgenbot?start=${uuid.value}`, '_blank');
};

const toggleMessage = async () => {
  if (showMessage.value) {
    await axios.post(`${apiLink}/messages/${message.value[0].id}/read`);

    await getMessage();
  }

  showMessage.value = !showMessage.value;
};
</script>
