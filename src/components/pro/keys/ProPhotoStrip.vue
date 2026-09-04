<template>
  <div class="pro-photos">
    <div class="pro-photos__title-row">
      <div class="pro-photos__title">{{ t('pro.photos.title') }}</div>
    </div>
    <div class="pro-photos__scroll" data-sbhide="1">
      <div class="pro-photos__wall">
        <div class="pro-photos__pole pro-photos__pole--left"></div>
        <div class="pro-photos__pole pro-photos__pole--right"></div>
        <div class="pro-photos__bracket pro-photos__bracket--left"></div>
        <div class="pro-photos__bracket pro-photos__bracket--right"></div>
        <div class="pro-photos__wire"></div>
        <div class="pro-photos__baseline"></div>
        <div
          v-for="(photo, i) in photos"
          :key="photo.img"
          :class="`pro-photos__polaroid--${i + 1}`"
          class="pro-photos__polaroid"
        >
          <div class="pro-photos__pin"></div>
          <div class="pro-photos__frame">
            <div class="pro-photos__image-box">
              <img :alt="t(`pro.photos.caption${i + 1}`)" :src="photo.src" class="pro-photos__image">
              <div class="pro-photos__halftone"></div>
            </div>
            <div class="pro-photos__caption">{{ t(`pro.photos.caption${i + 1}`) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import phQueue from '@/assets/images/pro/ph-queue.webp';
import phShelves from '@/assets/images/pro/ph-shelves.webp';
import phTalon from '@/assets/images/pro/ph-talon.webp';
import phNet from '@/assets/images/pro/ph-net.webp';
import phCounter from '@/assets/images/pro/ph-counter.webp';

const {t} = useI18n();

const photos = [
  {img: 'queue', src: phQueue},
  {img: 'shelves', src: phShelves},
  {img: 'talon', src: phTalon},
  {img: 'net', src: phNet},
  {img: 'counter', src: phCounter},
];
</script>
