<template>
  <div class="profile__directions">
    <div class="profile__directions-title">
      {{ t('cabinet.directions.byDevice') }}
    </div>
    <div class="profile__directions-cards swiper-container">
      <div class="profile__directions-wrapper swiper-wrapper">
        <template v-for="card in profileDirectionsCards.selectByDevice" :key="card.href">
          <a :href="card.href" class="profile__directions-slide swiper-slide" target="_blank" rel="noopener noreferrer">
            <div :class="`icon-${card.image}`" class="profile__directions-image"/>
            <div class="profile__directions-label">
              {{ card.label }}
            </div>
            <div class="profile__directions-arrow"/>
          </a>
        </template>
      </div>
    </div>
    <div class="profile__directions-title">
      {{ t('cabinet.directions.byProtocol') }}
    </div>
    <div class="profile__directions-cards swiper-container">
      <div class="profile__directions-wrapper swiper-wrapper">
        <template v-for="card in profileDirectionsCards.selectByProtocol" :key="card.href">
          <a :href="card.href" class="profile__directions-slide swiper-slide" target="_blank" rel="noopener noreferrer">
            <div :class="`icon-${card.image}`" class="profile__directions-image"/>
            <div class="profile__directions-label">
              {{ card.label }}
            </div>
            <div class="profile__directions-arrow"/>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import {profileDirectionsCards} from '@/assets/constants/profileConstants.js';

const {t} = useI18n();
</script>
