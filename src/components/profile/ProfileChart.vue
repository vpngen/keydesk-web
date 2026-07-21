<template>
  <div class="profile__chart">
    <div class="profile__chart-graph">
      <div class="profile__chart-title">
        {{ t('cabinet.chart.year') }}&nbsp;
        <div class="profile__chart-select">
          <span v-if="chartSelect === 1" @click.stop="chartSelectShow = !chartSelectShow">
            {{ t('cabinet.chart.activeUsers') }}
          </span>
          <span v-if="chartSelect === 2" @click.stop="chartSelectShow = !chartSelectShow">
            {{ t('cabinet.chart.totalUsers') }}
          </span>
          <span v-if="chartSelect === 3" @click.stop="chartSelectShow = !chartSelectShow">
            {{ t('cabinet.chart.traffic') }}
          </span>
        </div>
        <div v-if="chartSelectShow" ref="chartOptionsRef" class="profile__chart-options">
          <span v-if="chartSelect !== 1" @click.stop="select(1)">
            {{ t('cabinet.chart.activeUsers') }}
          </span>
          <span v-if="chartSelect !== 2" @click.stop="select(2)">
            {{ t('cabinet.chart.totalUsers') }}
          </span>
          <span v-if="chartSelect !== 3" @click.stop="select(3)">
            {{ t('cabinet.chart.traffic') }}
          </span>
        </div>
      </div>
      <div ref="chartScroll" class="profile__chart-scroll">
        <div class="profile__chart-line">
          <ChartLine v-if="chartList" :select="chartSelect" :stats="chartList"/>
        </div>
      </div>
    </div>
    <div class="profile__chart-data">
      <div class="profile__chart-title">
        {{ t('cabinet.chart.currentMonth') }}
      </div>
      <div class="profile__chart-buttons">
        <button :class="{'is-select': chartSelect === 1}" class="profile__chart-button" type="button"
                @click="select(1)">
          <span v-if="chartList" class="profile__chart-num">
            {{ chartList.ActiveUsers[11].Value }}
            <span v-if="iconActiveUsers">
              <SvgIcon :name="iconActiveUsers"/>
            </span>
          </span>
          <span class="profile__chart-text">
            {{ t('cabinet.chart.activeUsersShort') }}
          </span>
        </button>
        <button :class="{'is-select': chartSelect === 2}" class="profile__chart-button" type="button"
                @click="select(2)">
          <span v-if="chartList" class="profile__chart-num">
            {{ chartList.TotalUsers[11].Value }}
            <span v-if="iconTotalUsers">
              <SvgIcon :name="iconTotalUsers"/>
            </span>
          </span>
          <span class="profile__chart-text">
            {{ t('cabinet.chart.totalUsersShort') }}
          </span>
        </button>
        <button :class="{'is-select': chartSelect === 3}" class="profile__chart-button" type="button"
                @click="select(3)">
          <span v-if="chartList" class="profile__chart-num">
            {{ chartList.TotalTrafficGB[11].Value }}Gb
            <span v-if="iconTotalTraffic">
              <SvgIcon :name="iconTotalTraffic"/>
            </span>
          </span>
          <span class="profile__chart-text">
            {{ t('cabinet.chart.trafficShort') }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import SvgIcon from '@/components/SvgIcon.vue';
import ChartLine from '@/components/ChartLine.vue';
import useClickOutside from '@/assets/hooks/useClickOutside.js';

const props = defineProps({
  chartList: {
    type: [Object, Boolean],
    default: false,
  },
});

const {t} = useI18n();

const chartSelect = ref(1);
const chartSelectShow = ref(false);
const chartOptionsRef = ref(null);
const chartScroll = ref(null);

const trendIcon = (key) => {
  if (!props.chartList) return '';
  const list = props.chartList[key];
  const last = list[11].Value;
  const prev = list[10].Value;
  if (last > prev) return 'icon-stats-up';
  if (last < prev) return 'icon-stats-down';
  return '';
};

const iconActiveUsers = computed(() => trendIcon('ActiveUsers'));
const iconTotalUsers = computed(() => trendIcon('TotalUsers'));
const iconTotalTraffic = computed(() => trendIcon('TotalTrafficGB'));

useClickOutside(chartOptionsRef, () => {
  chartSelectShow.value = false;
});

const select = (value) => {
  chartSelect.value = value;
  chartSelectShow.value = false;
};

defineExpose({chartScroll});
</script>
