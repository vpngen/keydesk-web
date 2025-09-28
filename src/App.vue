<template>
  <template v-if="isVIP !== undefined">
    <HeaderInset/>
    <RouterView/>
    <Footer/>
    <template v-if="isVIP && isHomePage">
      <picture>
        <source media="(max-width: 767px)" srcset="./assets/images/vip/scepter-mob-vip.png"/>
        <source media="(min-width: 768px)" srcset="./assets/images/vip/scepter-vip.png"/>
        <img alt="VIP" class="scepter" src="./assets/images/vip/scepter-vip.png"/>
      </picture>
    </template>
    <TheLoader/>
  </template>
</template>

<script setup>
import HeaderInset from './components/HeaderInset.vue';
import Footer from './components/Footer.vue';
import TheLoader from "@/components/TheLoader.vue";
import {useProfileStore} from "@/store/profile";
import {storeToRefs} from "pinia";
import {computed, onMounted, ref, watch} from "vue";
import axios from "axios";
import {apiLink} from "@/const/api";
import jwtDecode from "jwt-decode";
import {useRoute} from "vue-router";

const route = useRoute();

const profileStore = useProfileStore();
const {isVIP, urlVIP, uuid} = storeToRefs(profileStore);

const isHomePage = computed(() => route.name === 'Home');

const token = ref(null);

const getToken = async () => {
  await axios.post(`${apiLink}/token`)
    .then((r) => {
      token.value = r.data.Token;
      const decoded = jwtDecode(token.value);
      isVIP.value = decoded.vip;
      urlVIP.value = decoded.vip_url;
      uuid.value = decoded.sub;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
    });
};

watch(() => [isVIP.value, isHomePage.value], () => {
  const elApp = document.getElementById('app');
  if (isVIP.value && isHomePage.value) {
    elApp.classList.add('vip');
  } else {
    elApp.classList.remove('vip');
  }
});

onMounted(() => {
  getToken();
})

</script>

<style lang="scss" src="./assets/scss/main.scss"></style>
