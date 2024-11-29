<template>
	<Line id="chartLine" :data="chartNewData" :options="chartOptions"/>
</template>

<script setup>
import { computed } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
	stats: Object,
	select: Number
});

const defaultMonth = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const statsMonth = props.stats.ActiveUsers.map(month => defaultMonth[month.Month - 1]);
const statsActiveUsersValue = {data: props.stats.ActiveUsers.map(activeUsers => activeUsers.Value)};
const statsTotalUsersValue = {data: props.stats.TotalUsers.map(totalUsers => totalUsers.Value)};
const statsTotalTrafficValue = {data: props.stats.TotalTrafficGB.map(totalTrafficGB => totalTrafficGB.Value)};
const chartStyle = {
	tension: 0.4,
	borderWidth: 1,
	borderColor: '#000000',
	backgroundColor: '#000000',
	pointHitRadius: 8,
	pointRadius: 4,
	pointHoverRadius: 5,
	pointBorderColor: '#ffffff',
	segment: {
		borderDash: ctx => ctx.p1DataIndex === 11 ? [6, 6] : undefined
	}
};

const chartNewData = computed(() => {
	return chartObject[props.select - 1];
});

const chartObject = [
	{
		labels: statsMonth,
		datasets: [
			{...statsActiveUsersValue, ...chartStyle}
		]
	},
	{
		labels: statsMonth,
		datasets: [
			{...statsTotalUsersValue, ...chartStyle}
		]
	},
	{
		labels: statsMonth,
		datasets: [
			{...statsTotalTrafficValue, ...chartStyle}
		]
	}
];

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false,
		},
		tooltip: {
			backgroundColor: '#eff7f8',
			bodyColor: '#000000',
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
				bottom: 8
			},
			caretPadding: 10,
			caretSize: 7,
			cornerRadius: 3,
			borderWidth: 1,
			borderColor: '#4cbfa6',
			displayColors: false,
			callbacks: {
				title: function() {
					let title = false;

					return title;
				}
			}
		}
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
					lineHeight: 1.2
				},
				color: '#8f8f8f'
			}
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
					lineHeight: 1.2
				},
				color: '#8f8f8f'
			}
		}
	}
};
</script>
