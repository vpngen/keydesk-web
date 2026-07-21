<template>
  <div v-if="isLoading" class="loader">
    <div class="loader__overlay welcome"/>
    <div class="loader__container">
      <div class="loader__active-circle"></div>
      <div class="loader__container-overlay"></div>
      <div class="loader__content">
        <div class="loader__logo"/>
        <div class="loader__text">
          Generating...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {storeToRefs} from 'pinia';
import {useLoadingStore} from '@/store/loading';

const loadingStore = useLoadingStore();
const {isLoading} = storeToRefs(loadingStore);
</script>
