<template>
  <div class="profile__data swiper-container">
    <h2 class="profile__title">
      {{ t('cabinet.profile.dataCollectionTitle') }}
    </h2>
    <div class="profile__select swiper-wrapper">
      <div class="profile__option swiper-slide">
        <button :class="{'is-select': activeTab === 1}" class="button button--option1" data-button="1" type="button"
                @click="activeTab = 1">
          {{ t('cabinet.tabs.stats') }}
        </button>
      </div>
      <div class="profile__option swiper-slide">
        <button :class="{'is-select': activeTab === 2}" class="button button--option1" data-button="2" type="button"
                @click="activeTab = 2">
          {{ t('cabinet.tabs.instructions') }}
        </button>
      </div>
      <div class="profile__option swiper-slide">
        <button :class="{'is-select': activeTab === 3}" class="button button--option1" data-button="3" type="button"
                @click="activeTab = 3">
          {{ t('cabinet.tabs.data') }}
        </button>
      </div>
      <div class="profile__option swiper-slide">
        <button :class="{'is-select': activeTab === 4}" class="button button--option3" data-button="4" type="button"
                @click="activeTab = 4">
          {{ t('cabinet.tabs.faq') }}
        </button>
      </div>
    </div>
    <div class="profile__tabs">
      <div v-show="activeTab === 1" class="profile__tab" data-tab="1">
        <ProfileChart ref="chartRef" :chart-list="chartList"/>
      </div>
      <div v-show="activeTab === 2" class="profile__tab" data-tab="2">
        <ProfileInstructions/>
      </div>
      <div v-show="activeTab === 3" class="profile__tab" data-tab="3">
        <ProfileDataTable/>
      </div>
      <div v-show="activeTab === 4" class="profile__tab" data-tab="4">
        <ShowMoreList/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import Swiper from 'swiper';
import 'swiper/css';
import ShowMoreList from './ShowMoreList.vue';
import ProfileChart from './ProfileChart.vue';
import ProfileInstructions from './ProfileInstructions.vue';
import ProfileDataTable from './ProfileDataTable.vue';

defineProps({
  chartList: {
    type: [Object, Boolean],
    default: false,
  },
});

const {t} = useI18n();

const activeTab = ref(1);
const chartRef = ref(null);

const initSwiperData = () => {
  new Swiper('.profile__data', {
    slidesPerView: 'auto',
    spaceBetween: 0,
    loop: false,
    allowTouchMove: window.screen.width <= 1023,
  });
};

const initSwiperDirections = () => {
  new Swiper('.profile__directions-cards', {
    slidesPerView: 'auto',
    spaceBetween: 0,
    loop: false,
    allowTouchMove: window.screen.width <= 767,
  });
};

const nudgeChartScroll = () => {
  const el = chartRef.value?.chartScroll;
  if (el) el.scrollLeft += 1000;
};

onMounted(() => {
  if (window.screen.width <= 1023) {
    initSwiperData();
    window.addEventListener('resize', initSwiperData);
    nudgeChartScroll();
  }
  if (window.screen.width <= 767) {
    initSwiperDirections();
    window.addEventListener('resize', initSwiperDirections);
    nudgeChartScroll();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', initSwiperData);
  window.removeEventListener('resize', initSwiperDirections);
});
</script>
