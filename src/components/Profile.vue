<template lang="pug">
include ../assets/pug/base
include ../assets/pug/data
+b.profile
	+e.headline
		+e.H2.title
			!=`${data.profile.headline.title}{{ usersList?.length ? usersList[0].UserName : 'Brigadier' }}`
		+e.search
			+e.filter-block
				FiltersPanel(
						v-if="statusList"
						:statusList="statusList",
						:selectedFilterSort="selectedFilterSort",
						:selectedFilterStatus="selectedFilterStatus",
						@update:selectedFilterSort="selectedFilterSort = $event",
						@update:selectedFilterStatus="selectedFilterStatus = $event")
			+e.search-block
				+e.add-label(:class="highlightedElementProperties.searchButton.highlight")
					+e.INPUT.search-input(
						type="text",
						placeholder="Поиск",
						v-model="filterUserText",
						ref="searchButton",
						:disabled="highlightedElementProperties.searchButton.disabled")
					+button(data.profile.headline.search, 'button', 'search-button')(:disabled="highlightedElementProperties.searchButton.disabled")
				+e.add-button()
					+button(data.profile.headline.button, 'button')(
						id='welcome-add-end'
						ref='buttonAddUser'
						@click="toggleDialogOs"
						:disabled="highlightedElementProperties.buttonAddUser.disabled"
						:class="highlightedElementProperties.buttonAddUser.highlight")
	+e.message(v-if="messageShow")
		+e.message-icon
			SvgIcon(name="icon-status-deactive")
		+e.message-text
			| Бригада будет закрыта, в&nbsp;случае, если в&nbsp;текущем месяце насчитывается меньше 5&nbsp;активных пользователей
		+e.message-close(@click="messageClose = true")
			SvgIcon(name="icon-close")
	+e.cards
		+e.card(
			v-for="(user, index) in filteredUsers",
			:key="user.UserID",
			:class="`${highlightedElementProperties[getRefForHighlight(index)].highlight}`",
			:ref="user.ref")
			+e.card-headline
				+e.card-status(:class="`${user.Status} tooltip`",
					:data-user="`${profileCardStatus.statusHint[user.Status]}`")
				+e.card-logo
					+e.SPAN.card-icon
						SvgIcon(:name="index===0?'icon-card-brigadier':'icon-card'")
				+e.P.card-name
					| {{ user.UserName }}
			+e.UL.card-features
				+e.LI.card-feature(v-if="user.LastVisitHour")
					| #[b Последний визит:]#[span {{ formattedDate(user.LastVisitHour) }}]
				+e.LI.card-feature(v-if="user.MonthlyQuotaRemainingGB !== undefined")
					| #[b Лимит трафика:]#[span {{ user.MonthlyQuotaRemainingGB }}&nbsp;GB]
				+e.LI.card-feature
					+e.status-caption
					| #[b Статус:]
					+e.status-color(:class="`profile__status-color-${user.Status}`")
					+e.status-description
						| {{profileCardStatus.statusName[user.Status]}}
				+e.LI.card-feature(v-if="false")
					| #[b AS:]#[SvgIcon(name='icon-de', v-if="user.LastVisitSubnet")]#[span(v-if="user.LastVisitSubnet") {{ user.LastVisitSubnet }}]
			+e.BUTTON.card-button(
				type="button",
				v-if="index !== 0"
				@click="openDialogUser(user.UserID)"
				:disabled="highlightedElementProperties.secondUserProfileCard.disabled")
				| Удалить
		+e.add(@click="toggleDialogOs")
			+e.add-icon
				SvgIcon(name='icon-add')
			+e.P.add-text
				| Добавить<br>пользователя
	+e.data.swiper-container
		+e.H2.title
			!=data.profile.title
		+e.select.swiper-wrapper
			+e.option.swiper-slide
				+button('Статистика бригады', 'button', 'option1', false, 1)(:class="showTab === 1 ? selectClass : ''", @click="showTab = 1")
			+e.option.swiper-slide
				+button('Какие данные мы собираем?', 'button', 'option1', false, 2)(:class="showTab === 2 ? selectClass : ''", @click="showTab = 2")
			+e.option.swiper-slide
				+button('FAQ', 'button', 'option3', false, 3)(:class="showTab === 3 ? selectClass : ''", @click="showTab = 3")
		+e.tabs
			+e.tab(data-tab="1" v-show="showTab === 1")
				+e.chart
					+e.chart-graph
						+e.chart-title
							| За год&nbsp;
							+e.chart-select
								+e.SPAN(v-if="chartSelect === 1" @click.stop="chartSelectShow = chartSelectShow.value ? false : true") кол-во активных пользователей
								+e.SPAN(v-if="chartSelect === 2" @click.stop="chartSelectShow = chartSelectShow.value ? false : true") общее кол-во пользователей
								+e.SPAN(v-if="chartSelect === 3" @click.stop="chartSelectShow = chartSelectShow.value ? false : true") объем трафика
							+e.chart-options(v-if="chartSelectShow" ref="chartOptionsRef")
								+e.SPAN(v-if="chartSelect !== 1" @click.stop="chartSelected(1)") кол-во активных пользователей
								+e.SPAN(v-if="chartSelect !== 2" @click.stop="chartSelected(2)") общее кол-во пользователей
								+e.SPAN(v-if="chartSelect !== 3" @click.stop="chartSelected(3)") объем трафика
						+e.chart-scroll(ref='chartScroll')
							+e.chart-line
								ChartLine(v-if="chartList" :stats="chartList" :select="chartSelect")
					+e.chart-data
						+e.chart-title
							| Текущий месяц
						+e.chart-buttons
							+e.BUTTON.chart-button(type="button" :class="chartSelect === 1 ? selectClass : ''" @click="chartSelected(1)")
								+e.chart-num(v-if="chartList")
									| {{ chartList.ActiveUsers[11].Value }}
									+e.SPAN(v-if="iconActiveUsers")
										SvgIcon(:name="iconActiveUsers")
								+e.chart-text
									| Кол-во активных пользователей
							+e.BUTTON.chart-button(type="button" :class="chartSelect === 2 ? selectClass : ''" @click="chartSelected(2)")
								+e.chart-num(v-if="chartList")
									| {{ chartList.TotalUsers[11].Value }}
									+e.SPAN(v-if="iconTotalUsers")
										SvgIcon(:name="iconTotalUsers")
								+e.chart-text
									| Общее кол-во пользователей
							+e.BUTTON.chart-button(type="button" :class="chartSelect === 3 ? selectClass : ''" @click="chartSelected(3)")
								+e.chart-num(v-if="chartList")
									| {{ chartList.TotalTrafficGB[11].Value }}Gb
									+e.SPAN(v-if="iconTotalTraffic")
										SvgIcon(:name="iconTotalTraffic")
								+e.chart-text
									| Объем трафика
			+e.tab(data-tab="2" v-show="showTab === 2")
				+e.table
					+e.table
						+e.table-head
							+e.table-title
								| Тип данных
							+e.table-column
								| Юзер
							+e.table-column
								| Бригадир
						each line in data.dataCollection
							+e.table-line
								+e.table-title
									!=line.type
								+e.table-column(data-user=`${line.user}`)(class=`${line.user}`? "tooltip" : "")
									SvgIcon(name=`icon-status-${line.user ? 'on' : 'off'}`)
								+e.table-column(data-user=`${line.brigadier}`)(class=`${line.brigadier}`? "tooltip" : "")
									SvgIcon(name=`icon-status-${line.brigadier ? 'on' : 'off'}`)
			+e.tab(data-tab="3" v-show="showTab === 3")
				ShowMoreList

DialogUser(v-if="showDialogUser" :userId="deletedUserId" @close="closeDialogUser" @removeUser="removeUser")
DialogOs(v-if="showDialogOs" @close="toggleDialogOs" @next="openDialogQrCode" @skip="skipDialogConfig")
DialogQrCode(
	v-if="showDialogQrCode"
	:configName="configName"
	:userData="userData"
	:title="titleDialogQrCode"
	:chosenOS="chosenOS"
	@close="closeDialogQrCode"
	)
DialogConfig(v-if="showDialogConfig" :configName="configName" :userData="userData" @close="closeDialogConfig")
WelcomePage(
	v-if="usersList.length && !isInstructionHidden"
	@getUsers="getUsers()"
	@toggleDisable="toggleDisableAll"
	@highlightElement="highlightElement"
	@darkenElement="darkenElement"
	:elementStepTwo="firstUserProfileCard"
	:elementStepThree="buttonAddUser"
	:elementStepFive="secondUserProfileCard"
	:elementStepSix="searchButton"
)
PopupError(v-if="isError" )

</template>

<script setup>
import {computed, ref, inject, onMounted, onUnmounted } from "vue";
import axios from 'axios';
import ChartLine from './ChartLine.vue';
import SvgIcon from './SvgIcon.vue';
import DialogUser from './DialogUser.vue';
import DialogOs from './DialogOs.vue';
import DialogQrCode from './DialogQrCode.vue';
import DialogConfig from './DialogConfig.vue';
import WelcomePage from "@/components/WelcomePage.vue";
import ShowMoreList from "@/components/ShowMoreList.vue";
import {mockedDataProfile, profileCardStatus, sortingMap, statusMap} from '@/assets/constants/profileConstants.js'
import {generateHighlightedElementProperties} from "@/assets/helpers/profileHelpers";
import PopupError from "@/components/PopupError.vue";
import FiltersPanel from "@/components/FiltersPanel.vue";
import useClickOutside from '@/assets/hooks/useClickOutside.js';
import Swiper from 'swiper';
import 'swiper/css';

let buttonAddUser, firstUserProfileCard, secondUserProfileCard, searchButton;

const filterUserText = ref('');
const token = ref(null);
const titleDialogQrCode = ref('');
const userData = ref({});
const usersList = ref([]);
const isError = ref(false);
const selectedFilterSort = ref(sortingMap.dateAsc);
const selectedFilterStatus = ref(statusMap.all);
const statusList = ref();
const chartList = ref(false);
const chartSelect = ref(1);
const chartSelectShow = ref(false);
const messageClose = ref(false);
const showTab = ref(1);
const loadingService = inject('loadingService');
const chartOptionsRef = ref(null);
const chartScroll = ref();
const showDialogOs = ref(false);
const showDialogQrCode = ref(false);
const showDialogConfig = ref(false);
const chosenOS = ref(null);

onMounted(()=>{
	if (window.screen.width <= 767) {
		initSwiper();
		window.addEventListener('resize', initSwiper);

		chartScroll.value.scrollLeft += 1000;
	}
})

onUnmounted(()=>{
	window.removeEventListener('resize', initSwiper);
})

const initSwiper = () => {
	const deviceSwiper = new Swiper('.swiper-container', {
		slidesPerView: "auto",
		spaceBetween: 0,
		loop: false,
		allowTouchMove: window.screen.width <= 767,
	});
}

useClickOutside(chartOptionsRef, () => {
	chartSelectShow.value = false;
});
const chartSelected = (value) => {
	chartSelect.value = value;
	chartSelectShow.value = false;
};

const highlightedElementProperties = ref(generateHighlightedElementProperties(buttonAddUser, firstUserProfileCard, secondUserProfileCard, searchButton));

const formattedDate = (data) => {
	const date = new Date(data);

	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear().toString();
	const hours = date.getHours().toString().padStart(2, '0');

	return `${day}.${month}.${year} ~${hours}:00`;
};

const selectClass = 'is-select';
let apiLink = '';
if (process.env.NODE_ENV === 'development') {
	apiLink = 'https://keydesk.ussr.vpngen.org';
}

const isInstructionHidden = ref(true);
const getUsers = async () =>  {
	usersList.value = await axios.get(`${apiLink}/user`)
	.then((r) => r.data)
	.catch(async (error) => {
		if (error.response.status === 401) {
			await getToken();
			getUsers();
		} else {
			isError.value = true;
			console.error(error);
		}
	});
	if (localStorage.getItem('isInstructionHidden')){
			statusList.value =  new Set(usersList.value?.map(user => user.Status))
	}
};

const getChart = async () => {
	chartList.value = await axios.get(`${apiLink}/users/stats`)
	.then((r) => r.data)
	.catch(async (error) => {
		if (error.response.status === 401) {
			await getToken();
			getChart();
		} else {
      		isError.value = true;
			console.error(error);
		}
	}).finally(() => {
		loadingService.hide();
	});
};

const iconActiveUsers = computed(() => {
	return chartList.value && chartList.value.ActiveUsers[11].Value > chartList.value.ActiveUsers[10].Value ?
	"icon-stats-up" :
	chartList.value.ActiveUsers[11].Value < chartList.value.ActiveUsers[10].Value ?
	"icon-stats-down" : '';
});

const iconTotalUsers = computed(() => {
	return chartList.value && chartList.value.TotalUsers[11].Value > chartList.value.TotalUsers[10].Value ?
	"icon-stats-up" :
	chartList.value.TotalUsers[11].Value < chartList.value.TotalUsers[10].Value ?
	"icon-stats-down" : '';
});

const iconTotalTraffic = computed(() => {
	return chartList.value && chartList.value.TotalTrafficGB[11].Value > chartList.value.TotalTrafficGB[10].Value ?
	"icon-stats-up" :
	chartList.value.TotalTrafficGB[11].Value < chartList.value.TotalTrafficGB[10].Value ?
	"icon-stats-down" : '';
});

const messageShow = computed(() => {
	return !messageClose.value && chartList.value && chartList.value.ActiveUsers[11].Value < 5;
});

const getRefForHighlight = (index) => {
	return index===0 ? 'firstUserProfileCard' : 'secondUserProfileCard'
}

const getToken = async () => {
	loadingService.show();
	await axios.post(`${apiLink}/token`).then((r) => {
		token.value = r.data.Token
		axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;

		getChart();

		isInstructionHidden.value = localStorage.getItem('isInstructionHidden');
		if (isInstructionHidden.value) {
			getUsers();
		} else {
			usersList.value = mockedDataProfile;
		}
	}).catch(error => {
        console.error(error);
	});

	buttonAddUser = ref(null);
	firstUserProfileCard = ref(null);
	secondUserProfileCard = ref(null);
	searchButton = ref(null);
}

getToken();

const addUser = async (type) => {
		await axios.post(`${apiLink}/user`, {}, {
			responseType: 'application/json',
			headers: {
				'accept': 'application/json'
			}
		}).then((r) => {
			const configList = require('../../vpn_sistems_config.json');
			const configType = configList.system_defaults[type];
			configName.value = configType;
			userData.value = JSON.parse(r.data);
			getUsers();
		}).catch(async (error) => {
			if (error.response.status === 401) {
				await getToken();
				addUser(type);
			} else {
				isError.value = true;
				console.error(error);
			}
		}).finally(() => {
			loadingService.hide();
			if (type === 'other') {
				showDialogOs.value = !showDialogOs.value;
				showDialogConfig.value = !showDialogConfig.value;
			} else {
				titleDialogQrCode.value = type;
				showDialogOs.value = !showDialogOs.value;
				showDialogQrCode.value = !showDialogQrCode.value;
			}
		});
};

const removeUser = async (id) => {
	loadingService.show();
	await axios.delete(`${apiLink}/user/${id}`)
			.then(() => {
				showDialogUser.value = false;
				deletedUserId.value = null;
				getUsers()
			}).catch(async (error) => {
				if (error.response.status === 401) {
					await getToken()
					removeUser(deletedUserId.value)
				} else {
					isError.value = true;
					console.error(error)
				}
			}).finally(() => {
				loadingService.hide();
			});
}

const filteredUsers = computed(() => {
	let filter = filterUserText.value

	if (usersList.value.length && localStorage.getItem('isInstructionHidden')) {
      let [firstElement, ...userListCopy] = usersList.value
      switch (selectedFilterStatus.value) {
					case statusMap.green:
              userListCopy =  userListCopy.filter(user =>
                  user.Status.toLowerCase().includes(statusMap.green)
              );
              break;
          case statusMap.black:
              userListCopy =  userListCopy.filter(user =>
                  user.Status.toLowerCase().includes(statusMap.black)
              );
              break;
          case statusMap.grey:
              userListCopy =  userListCopy.filter(user =>
                  user.Status.toLowerCase().includes(statusMap.grey)
              );
              break;
          case statusMap.yellow:
              userListCopy =  userListCopy.filter(user =>
                  user.Status.toLowerCase().includes(statusMap.yellow)
              );
              break;
          case statusMap.red:
              userListCopy =  userListCopy.filter(user =>
                  user.Status.toLowerCase().includes(statusMap.red)
              )
              break;
      }

      switch (selectedFilterSort.value) {
					case sortingMap.nameAsc:
              userListCopy =  userListCopy.sort((a, b) => a.UserName.localeCompare(b.UserName));
              break;
          case sortingMap.nameDesc:
              userListCopy =  userListCopy.sort((a, b) => b.UserName.localeCompare(a.UserName));
              break;
          case sortingMap.dateAsc:
              userListCopy =  userListCopy.sort((a, b) => a?.CreatedAt.localeCompare(b?.CreatedAt));
              break;
          case sortingMap.dateDesc:
              userListCopy =  userListCopy.sort((a, b) => b?.CreatedAt.localeCompare(a?.CreatedAt));
              break;
      }

	  userListCopy = userListCopy.filter(user =>
          user.UserName.toLowerCase().includes(filter.toLowerCase())
      );

      return [firstElement, ...userListCopy]
	}
    return usersList.value;
})

const showDialogUser = ref(false);
const deletedUserId = ref(null);

const closeDialogUser = () => {
	showDialogUser.value = false;
};

const openDialogUser = (id) => {
	deletedUserId.value = id;
	showDialogUser.value = true
};

const toggleDialogOs = () => {
	showDialogOs.value = !showDialogOs.value;
};

const closeDialogQrCode = () => {
	showDialogQrCode.value = !showDialogQrCode.value;
};

const configName = ref('');

const openDialogQrCode = (type) => {
	loadingService.show();
	chosenOS.value = type;
	addUser(type.value)
};

const closeDialogConfig = () => {
	showDialogConfig.value = !showDialogConfig.value;
};

const skipDialogConfig = () => {
	loadingService.show();
	chosenOS.value = 'other';
	addUser('other')
};

const highlightElement = (path) => {
	highlightedElementProperties.value[path].highlight = 'highlight';
}

const darkenElement = (path) => {
	highlightedElementProperties.value[path].highlight = '';
}

const toggleDisableAll = () => {
	for (let key in highlightedElementProperties.value) {
		if (highlightedElementProperties.value[key].hasOwnProperty("disabled")) {
			highlightedElementProperties.value[key].disabled = !highlightedElementProperties.value[key].disabled;
		}
	}
}
</script>
