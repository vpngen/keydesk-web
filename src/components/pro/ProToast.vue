<template>
  <teleport to="#app">
    <div v-if="text" class="pro-toast">{{ text }}</div>
  </teleport>
</template>

<script setup>
import {storeToRefs} from 'pinia';
import {useProToastStore} from '@/store/proToast';

const proToastStore = useProToastStore();
const {text} = storeToRefs(proToastStore);
</script>
