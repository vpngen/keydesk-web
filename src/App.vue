<template>
  <HeaderInset/>
  <RouterView/>
  <Footer/>
  <template v-if="isVipSkin">
    <picture>
      <source media="(max-width: 767px)" srcset="./assets/images/vip/scepter-mob-vip.png"/>
      <source media="(min-width: 768px)" srcset="./assets/images/vip/scepter-vip.png"/>
      <img alt="VIP" class="scepter" src="./assets/images/vip/scepter-vip.png"/>
    </picture>
  </template>
  <TheLoader/>
  <teleport to="#app">
    <DialogConstruction
      v-if="isConstructionShown"
      :message="constructionMessage"
      :till="constructionTill"
    />
  </teleport>
</template>

<script setup>
import {storeToRefs} from "pinia";
import {computed, onMounted, watch} from "vue";
import {useRoute} from "vue-router";
import DialogConstruction from '@/components/dialogs/DialogConstruction.vue';
import HeaderInset from './components/HeaderInset.vue';
import Footer from './components/Footer.vue';
import TheLoader from "@/components/TheLoader.vue";
import {useAuthStore} from "@/store/auth";
import {useConstructionStore} from '@/store/construction';
import {useProfileStore} from "@/store/profile";
import {useTheme} from "@/composables/useTheme";
import {COUNTRY_THEMES} from "@/const/themes";
import {isDevOrStageHost} from "@/const/api";
import {isConstructionError} from '@/utils/apiErrors';

const route = useRoute();

const authStore = useAuthStore();
const constructionStore = useConstructionStore();
const profileStore = useProfileStore();
const {isVIP} = storeToRefs(profileStore);
const {themeName, isThemed} = useTheme();
const {
  isShown: isConstructionShown,
  till: constructionTill,
  message: constructionMessage,
} = storeToRefs(constructionStore);

const isHomePage = computed(() => route.name === 'Home');
const isVipRequested = computed(() => isDevOrStageHost && route.query.vip === 'true');
const isVipLayout = computed(() => (isVIP.value || isVipRequested.value) && isHomePage.value);
// Страновое оформление (claim country) вытесняет VIP-оформление (класс vip и скипетр), сами VIP-ключи остаются.
const isVipSkin = computed(() => isVipLayout.value && !isThemed.value);

watch(isVipSkin, (vipLayout) => {
  const elApp = document.getElementById('app');
  if (!elApp) return;

  if (vipLayout) {
    elApp.classList.add('vip');
  } else {
    elApp.classList.remove('vip');
  }
}, {immediate: true});

// Страновое оформление (claim country): класс theme-<code> на #app, см. assets/scss/themes.
watch(themeName, (name, previous) => {
  const elApp = document.getElementById('app');
  if (!elApp) return;

  if (previous && COUNTRY_THEMES[previous]) {
    elApp.classList.remove(COUNTRY_THEMES[previous].className);
  }
  if (name && COUNTRY_THEMES[name]) {
    elApp.classList.add(COUNTRY_THEMES[name].className);
  }
}, {immediate: true});

onMounted(() => {
  authStore.fetchToken().catch((error) => {
    if (isConstructionError(error)) return;
    console.error(error);
  });
});

</script>

<style lang="scss" src="./assets/scss/main.scss"></style>
