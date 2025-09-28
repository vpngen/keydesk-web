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
        <div v-if="token && !isVIP" class="header__vip">
          <button class="header__vip-button" @click="getVipFromLink">
            <span>VIP</span><span>-</span><span>Бригада</span>
          </button>
        </div>
      </div>
    </div>
  </header>
  <div v-if="token && isVIP" class="vip-banner">
    <span class="vip-banner__label">
      ТЕПЕРЬ ТЫ СУПЕР VIP, НАСЛАЖДАЙСЯ
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
