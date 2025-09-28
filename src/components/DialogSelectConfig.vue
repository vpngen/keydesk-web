<template>
  <div class="dialog-select-config">
    <div class="popup__overlay" @click="$emit('close')"></div>
    <div class="dialog-select-config__content">
      <div class="dialog-select-config__header">
        <h3 class="dialog-select-config__title">Выбери конфигурацию</h3>
        <button class="dialog-select-config__close" @click="$emit('close')">
          <SvgIcon name="icon-close"/>
        </button>
      </div>
      <div class="dialog-select-config__options">
        <div class="dialog-select-config__card dialog-select-config__card--basic" @click="$emit('select', 'basic')">
          <div class="dialog-select-config__card-header">
            <h4 class="dialog-select-config__card-title">Обычный VPN</h4>
          </div>
          <div class="dialog-select-config__card-price">
            <span class="dialog-select-config__card-price-text">Бесплатно</span>
          </div>
          <button class="dialog-select-config__card-button dialog-select-config__card-button--basic">
            Выбрать
          </button>
        </div>

        <div class="dialog-select-config__card dialog-select-config__card--vip" @click="$emit('select', 'vip')">
          <div class="dialog-select-config__card-header">
            <h4 class="dialog-select-config__card-title">VIP КОНФИГУРАЦИЯ</h4>
          </div>
          <div class="dialog-select-config__card-features">
            <p>МАКСИМАЛЬНАЯ СКОРОСТЬ</p>
            <p>БЕЗГРАНИЧНЫЙ ТРАФИК</p>
            <p>ОЧЕНЬ ЛАКШЕРИ</p>
          </div>
          <div class="dialog-select-config__card-price">
            <span class="dialog-select-config__card-price-text">€4</span>
          </div>
          <button class="dialog-select-config__card-button dialog-select-config__card-button--vip">
            Выбрать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue';

const emit = defineEmits(['close', 'select']);
</script>

