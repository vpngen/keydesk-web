<template>
  <Line id="chartLine" :data="chartNewData" :options="chartOptions"/>
</template>

<script setup>
import {computed} from "vue";
import {CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip} from 'chart.js'
import {Line} from 'vue-chartjs';
import {useProfileStore} from "@/store/profile";
import {storeToRefs} from "pinia";
import {useI18n} from 'vue-i18n';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const FALLBACK_MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

const props = defineProps({
  stats: Object,
  select: Number
});

const profileStore = useProfileStore();
const {isVIP} = storeToRefs(profileStore);

const {tm} = useI18n();

const monthNames = computed(() => {
  const m = tm('cabinet.chart.monthNames');
  return Array.isArray(m) && m.length === 12 ? m : FALLBACK_MONTH_NAMES;
});

const chartLabels = computed(() => {
  const list = props.stats?.ActiveUsers;
  if (!list?.length) {
    return [];
  }
  return list.map((month) => monthNames.value[month.Month - 1] ?? '');
});

const statsActiveUsersValue = computed(() => ({
  data: props.stats?.ActiveUsers?.map((activeUsers) => activeUsers.Value) ?? [],
}));
const statsTotalUsersValue = computed(() => ({
  data: props.stats?.TotalUsers?.map((totalUsers) => totalUsers.Value) ?? [],
}));
const statsTotalTrafficValue = computed(() => ({
  data: props.stats?.TotalTrafficGB?.map((totalTrafficGB) => totalTrafficGB.Value) ?? [],
}));

const chartStyle = computed(() => ({
  tension: 0.4,
  borderWidth: 1,
  borderColor: isVIP.value ? '#FFF293' : '#000000',
  backgroundColor: isVIP.value ? '#FFF293' : '#000000',
  pointHitRadius: 8,
  pointRadius: 4,
  pointHoverRadius: 5,
  pointBorderColor: isVIP.value ? '#FFF293' : '#000',
  segment: {
    borderDash: (ctx) => ctx.p1DataIndex === 11 ? [6, 6] : undefined,
  },
}));

const chartObject = computed(() => {
  const labels = chartLabels.value;
  const style = chartStyle.value;
  return [
    {
      labels,
      datasets: [
        {...statsActiveUsersValue.value, ...style},
      ],
    },
    {
      labels,
      datasets: [
        {...statsTotalUsersValue.value, ...style},
      ],
    },
    {
      labels,
      datasets: [
        {...statsTotalTrafficValue.value, ...style},
      ],
    },
  ];
});

const chartNewData = computed(() => {
  const idx = (props.select ?? 1) - 1;
  const list = chartObject.value;
  if (!list[idx]) {
    return {labels: [], datasets: [{data: [], ...chartStyle.value}]};
  }
  return list[idx];
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: isVIP.value ? '#3A3A3A' : '#eff7f8',
      bodyColor: isVIP.value ? '#FFF293' : '#000000',
      bodyFont: {
        weight: 700,
        family: '"Raleway", sans-serif',
        size: 14,
        lineHeight: 1.2,
      },
      padding: {
        left: 20,
        right: 20,
        top: 8,
        bottom: 8,
      },
      caretPadding: 10,
      caretSize: 7,
      cornerRadius: 3,
      borderWidth: 1,
      borderColor: isVIP.value ? '#FFF293' : '#4cbfa6',
      displayColors: false,
      callbacks: {
        title: function () {
          return false;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        drawTicks: true,
        tickLength: 6,
        tickWidth: 0,
        color: '#cacaca',
      },
      border: {
        color: '#ffffff',
      },
      ticks: {
        font: {
          family: '"Raleway", sans-serif',
          size: 10,
          lineHeight: 1.2,
        },
        color: isVIP.value ? '#FFF293' : '#8f8f8f',
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        drawTicks: false,
        color: '#cacaca',
      },
      ticks: {
        crossAlign: 'near',
        align: 'end',
        mirror: true,
        maxTicksLimit: 3,
        padding: 4,
        labelOffset: -2,
        stepSize: 0.5,
        font: {
          family: '"Raleway", sans-serif',
          size: 10,
          lineHeight: 1.2,
        },
        color: isVIP.value ? '#FFF293' : '#8f8f8f',
      },
    },
  },
}));
</script>
