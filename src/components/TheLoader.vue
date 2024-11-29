<template>
  <div class="loader" v-if="isLoading">
    <div class="loader__overlay welcome" />
    <div class="loader__container">
      <div class="loader__active-circle"></div>
      <div class="loader__container-overlay"></div>
      <div class="loader__content">
        <div class="loader__logo" />
        <div class="loader__text">
            Generating...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, inject} from "vue";

const loadingService = inject('loadingService');
const isLoading = computed(() => loadingService.state.isLoading);
</script>
