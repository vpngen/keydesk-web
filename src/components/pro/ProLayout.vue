<template>
  <div class="pro-layout">
    <div class="pro-layout__sheet">
      <ProHeader @open-tour="openTour"/>
      <slot/>
    </div>
  </div>
  <teleport to="#app">
    <ProTour v-if="isTourOpen" @close="closeTour"/>
  </teleport>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {storeToRefs} from 'pinia';
import ProHeader from '@/components/pro/ProHeader.vue';
import ProTour from '@/components/pro/ProTour.vue';
import {useProKeysStore} from '@/store/proKeys';
import {useProBillingStore} from '@/store/proBilling';
import {safeGetItem, safeSetItem} from '@/utils/safeStorage';

const TOUR_SEEN_KEY = 'isProTourSeen';

const route = useRoute();
const proKeysStore = useProKeysStore();
const proBillingStore = useProBillingStore();
const {isLoaded: keysLoaded} = storeToRefs(proKeysStore);
const {isLoaded: billingLoaded} = storeToRefs(proBillingStore);

const isTourOpen = ref(false);

const openTour = () => {
  isTourOpen.value = true;
};

const closeTour = () => {
  isTourOpen.value = false;
  safeSetItem(TOUR_SEEN_KEY, '1');
};

onMounted(async () => {
  if (!keysLoaded.value) {
    await proKeysStore.fetchKeys();
  }
  if (!billingLoaded.value) {
    await proBillingStore.fetchBilling();
  }
  if (route.name === 'Home' && !safeGetItem(TOUR_SEEN_KEY)) {
    isTourOpen.value = true;
  }
});
</script>
