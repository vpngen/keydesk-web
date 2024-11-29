<template>
	<div class="profile">
		<div class="profile__headline">
			<h2 class="profile__title">
				{{data.profile.headline.title}} {{ usersList?.length ? usersList[0].UserName : 'Brigadier' }}
			</h2>
			<div class="profile__search">
				<div class="profile__filter-block">
					<FiltersPanel
						v-if="statusList"
						:statusList="statusList"
						:selectedFilterSort="selectedFilterSort"
						:selectedFilterStatus="selectedFilterStatus"
						@update:selectedFilterSort="selectedFilterSort = $event"
						@update:selectedFilterStatus="selectedFilterStatus = $event"
					/>
				</div>
				<div class="profile__search-block">
					<div class="profile__add-label" :class="highlightedElementProperties.searchButton.highlight">
						<input
							class="profile__search-input"
							v-model="filterUserText"
							ref="searchButton"
							type="text"
							placeholder="Поиск"
							:disabled="highlightedElementProperties.searchButton.disabled"
						/>
						<button class="button button--search-button" :disabled="highlightedElementProperties.searchButton.disabled">{{ data.profile.headline.search }}</button>
					</div>
					<div class="profile__add-button">
						<button class="button" :class="highlightedElementProperties.buttonAddUser.highlight" id="welcome-add-end" ref="buttonAddUser" @click="addUserHandler" :disabled="highlightedElementProperties.buttonAddUser.disabled">{{ data.profile.headline.button }}</button>
					</div>
				</div>
			</div>
		</div>
		<div class="profile__message" v-if="isInstructionHidden && messageShow">
			<div class="profile__message-icon">
				<SvgIcon name="icon-status-deactive" />
			</div>
			<div class="profile__message-text">
				Бригада будет закрыта, в&nbsp;случае, если в&nbsp;текущем месяце насчитывается меньше 5&nbsp;активных пользователей
			</div>
			<div class="profile__message-close" @click="messageClose = true">
				<SvgIcon name="icon-close" />
			</div>
		</div>
		<div class="profile__cards">
			<template v-for="(user, index) in filteredUsers" :key="user.UserID">
				<div class="profile__card" :class="`${highlightedElementProperties[getRefForHighlight(index)].highlight}`" :ref="user.ref">
					<div class="profile__card-headline">
						<div
							class="profile__card-status"
							:class="`${user.Status} tooltip`"
							:data-user="`${profileCardStatus.statusHint[user.Status]}`"
				     />
						<div class="profile__card-logo">
							<span class="profile__card-icon">
								<SvgIcon :name="index === 0 ? 'icon-card-brigadier' : 'icon-card'"/>
							</span>
						</div>
						<a class="profile__card-name" :href="user.PersonDescLink" target="_blank">
							{{ user.UserName }}
						</a>
					</div>
					<ul class="profile__card-features">
						<li class="profile__card-feature" v-if="user.LastVisitHour">
							<b>Последний визит</b>
							<span>{{ formattedDate(user.LastVisitHour) }}</span>
						</li>
						<li class="profile__card-feature" v-if="user.MonthlyQuotaRemainingGB !== undefined">
							<b>Лимит трафика</b>
							<span>{{ user.MonthlyQuotaRemainingGB }} GB</span>
						</li>
						<li class="profile__card-feature">
							<div class="profile__status-caption">
								<b>Статус:</b>
							</div>
							<div class="profile__status-color" :class="`profile__status-color-${user.Status}`" />
							<div class="profile__status-description">
								{{profileCardStatus.statusName[user.Status]}}
							</div>
						</li>
						<li class="profile__card-feature" v-if="false">
							<b>
								<SvgIcon name="icon-de" v-if="user.LastVisitSubnet" />
								<span v-if="user.LastVisitSubnet">{{ user.LastVisitSubnet }}</span>
							</b>
						</li>
					</ul>
					<button
						class="profile__card-button"
						v-if="index !== 0"
						@click="openDialogUser(user.UserID)"
						:disabled="highlightedElementProperties.secondUserProfileCard.disabled"
					>
						Удалить
					</button>
				</div>
			</template>
			<div class="profile__add" @click="addUserHandler">
				<div class="profile__add-icon">
					<SvgIcon name='icon-add' />
				</div>
				<p class="profile__add-text">
					Добавить<br>пользователя
				</p>
			</div>
		</div>
		<div class="profile__data swiper-container">
			<h2 class="profile__title">
				{{ data.profile.title }}
			</h2>
			<div class="profile__select swiper-wrapper">
				<div class="profile__option swiper-slide">
					<button class="button button--option1" data-button="1" :class="{'is-select': showTab === 1}" @click="showTab = 1">Статистика бригады</button>
				</div>
				<div class="profile__option swiper-slide">
					<button class="button button--option1" data-button="2" :class="{'is-select': showTab === 2}" @click="showTab = 2">Инструкции</button>
				</div>
				<div class="profile__option swiper-slide">
					<button class="button button--option1" data-button="3" :class="{'is-select': showTab === 3}" @click="showTab = 3">Какие данные мы собираем?</button>
				</div>
				<div class="profile__option swiper-slide">
					<button class="button button--option3" data-button="4" :class="{'is-select': showTab === 4}" @click="showTab = 4">FAQ</button>
				</div>
			</div>
			<div class="profile__tabs">
				<div class="profile__tab" data-tab="1" v-show="showTab === 1">
					<div class="profile__chart">
						<div class="profile__chart-graph">
							<div class="profile__chart-title">
								За год&nbsp;
								<div class="profile__chart-select">
									<span v-if="chartSelect === 1" @click.stop="chartSelectShow = chartSelectShow.value ? false : true">
										кол-во активных пользователей
									</span>
									<span v-if="chartSelect === 2" @click.stop="chartSelectShow = chartSelectShow.value ? false : true">
										общее кол-во пользователей
									</span>
									<span v-if="chartSelect === 3" @click.stop="chartSelectShow = chartSelectShow.value ? false : true">
										объем трафика
									</span>
								</div>
								<div class="profile__chart-options" v-if="chartSelectShow" ref="chartOptionsRef">
									<span v-if="chartSelect !== 1" @click.stop="chartSelected(1)">
										кол-во активных пользователей
									</span>
									<span v-if="chartSelect !== 2" @click.stop="chartSelected(2)">
										общее кол-во пользователей
									</span>
									<span v-if="chartSelect !== 3" @click.stop="chartSelected(3)">
										объем трафика
									</span>
								</div>
							</div>
							<div class="profile__chart-scroll" ref='chartScroll'>
								<div class="profile__chart-line">
									<ChartLine v-if="chartList" :stats="chartList" :select="chartSelect" />
								</div>
							</div>
						</div>
						<div class="profile__chart-data">
							<div class="profile__chart-title">
								Текущий месяц
							</div>
							<div class="profile__chart-buttons">
								<button class="profile__chart-button" :class="{'is-select': chartSelect === 1}" @click="chartSelected(1)">
									<span class="profile__chart-num" v-if="chartList">
										{{ chartList.ActiveUsers[11].Value }}
										<span v-if="iconActiveUsers">
											<SvgIcon :name="iconActiveUsers" />
											</span>
									</span>
									<span class="chart-text">
										Кол-во активных пользователей
									</span>
								</button>
								<button class="profile__chart-button" :class="{'is-select': chartSelect === 2}" @click="chartSelected(2)">
									<span class="profile__chart-num" v-if="chartList">
										{{ chartList.TotalUsers[11].Value }}
										<span v-if="iconTotalUsers">
											<SvgIcon :name="iconTotalUsers" />
											</span>
									</span>
									<span class="profile__chart-text">
										Общее кол-во пользователей
									</span>
								</button>
								<button class="profile__chart-button" :class="{'is-select': chartSelect === 3}" @click="chartSelected(3)">
									<span class="profile__chart-num" v-if="chartList">
										{{ chartList.TotalTrafficGB[11].Value }}Gb
										<span v-if="iconTotalTraffic">
											<SvgIcon :name="iconTotalTraffic" />
										</span>
									</span>
									<span class="profile__chart-text">
										Объем трафика
									</span>
								</button>
							</div>
						</div>
					</div>
					<p class="profile__chart-note">
						&laquo;Нам эти данные не&nbsp;нужны, но&nbsp;это минимально необходимый по&nbsp;закону набор данных для запросов властей юрисдикций VPN-серверов. Все данные защищены шифрованием с&nbsp;ключом, разделенным между командой посуточно побригадно, таким образом, что расшифровать ключ можно только при согласии большинства держателей ключа и&nbsp;расшифровываться будет ровно&nbsp;то, что запросят.&raquo;
					</p>
				</div>
				<div class="profile__tab" data-tab="2" v-show="showTab === 2">
					<div class="profile__directions">
						<div class="profile__directions-title">
							Выбор по устройству
						</div>
						<div class="profile__directions-cards swiper-container">
							<div class="profile__directions-wrapper swiper-wrapper">
								<template v-for="card in profileDirectionsCards.selectByDevice">
									<a class="profile__directions-slide swiper-slide" :href="card.href" target="_blank">
										<div class="profile__directions-image" :class="`icon-${card.image}`" />
										<div class="profile__directions-label">
											{{ card.label }}
										</div>
										<div class="profile__directions-arrow" />
									</a>
								</template>
							</div>
						</div>
						<div class="profile__directions-title">
							Выбор по протоколу
						</div>
						<div class="profile__directions-cards swiper-container">
							<div class="profile__directions-wrapper swiper-wrapper">
								<template v-for="card in profileDirectionsCards.selectByProtocol">
									<a class="profile__directions-slide swiper-slide" :href="card.href" target="_blank">
										<div class="profile__directions-image" :class="`icon-${card.image}`" />
										<div class="profile__directions-label">
											{{ card.label }} {{card.image}}
										</div>
										<div class="directions-arrow" />
									</a>
								</template>
							</div>
						</div>
					</div>
				</div>
				<div class="profile__tab" data-tab="3" v-show="showTab === 3">
					<div class="profile__table">
						<div class="profile__table">
							<div class="profile__table-head">
								<div class="profile__table-title">
									Тип данных
								</div>
								<div class="profile__table-column">
									Юзер
								</div>
								<div class="profile__table-column">
									Бригадир
								</div>
							</div>
							<template v-for="line in data.dataCollection">
								<div class="profile__table-line">
									<div class="profile__table-title">
										{{ line.type }}
									</div>
									<div class="profile__table-column" :data-user="line.user" :class="{'tooltip': line.user}">
										<SvgIcon :name="`icon-status-${line.user ? 'on' : 'off'}`" />
									</div>
									<div class="profile__table-column" :data-user="line.brigadier" :class="{'tooltip': line.brigadier}">
										<SvgIcon :name="`icon-status-${line.brigadier ? 'on' : 'off'}`" />
									</div>
								</div>
							</template>
						</div>
					</div>
				</div>
				<div class="profile__tab" data-tab="4" v-show="showTab === 4">
					<ShowMoreList />
				</div>
			</div>
		</div>
	</div>
	<DialogUser v-if="showDialogUser" :userId="deletedUserId" @close="closeDialogUser" @removeUser="removeUser"/>
	<DialogOs
		v-if="showDialogOs"
		@close="toggleDialogOsHandler"
		@next="openDialogQrCodeHandler"
		@skip="skipDialogConfig"
	/>
	<DialogOther
		v-if="showDialogOther"
		:chosenClient="chosenClient"
		@close="toggleDialogOtherHandler"
		@next="switchDialogConfigHandler"
		@back="openDialogQrCodeHandler('linux')"
	/>
	<DialogQrCode
		v-if="showDialogQrCode"
		:configName="configName"
		:userData="userData"
		:title="titleDialogQrCode"
		:chosenOS="chosenOS"
		@close="closeDialogQrCodeHandler"
		@others="returnToOthersHandler"
	/>
	<DialogConstruction
		v-if="showDialogConstruction"
		:till="tillConstruction"
		:message="messageConstruction"
	/>
	<DialogConfig
		v-if="showDialogConfig"
		:clientName="chosenClient"
		:userData="userData"
		@close="togleDialogConfigHandler"
		@back="switchDialogConfigHandler"
	/>
	<WelcomePage
		v-if="usersList.length && !isInstructionHidden"
		@getUsers="getUsers()"
		@toggleDisable="toggleDisableAll"
		@highlightElement="highlightElement"
		@darkenElement="darkenElement"
		:elementStepTwo="firstUserProfileCard"
		:elementStepThree="buttonAddUser"
		:elementStepFive="secondUserProfileCard"
		:elementStepSix="searchButton"
	/>
	<PopupError v-if="isError" />
</template>

<script setup>
import {computed, ref, inject, onMounted } from "vue";
import axios from 'axios';
import ChartLine from './ChartLine.vue';
import SvgIcon from './SvgIcon.vue';
import DialogUser from './DialogUser.vue';
import DialogOs from './DialogOs.vue';
import DialogQrCode from './DialogQrCode.vue';
import DialogConstruction from './DialogConstruction.vue';
import DialogConfig from './DialogConfig.vue';
import WelcomePage from "@/components/WelcomePage.vue";
import ShowMoreList from "@/components/ShowMoreList.vue";
import {mockedDataProfile, profileCardStatus, sortingMap, statusMap, profileDirectionsCards} from '@/assets/constants/profileConstants.js'
import {generateHighlightedElementProperties} from "@/assets/helpers/profileHelpers";
import PopupError from "@/components/PopupError.vue";
import FiltersPanel from "@/components/FiltersPanel.vue";
import useClickOutside from '@/assets/hooks/useClickOutside.js';
import Swiper from 'swiper';
import 'swiper/css';
import DialogOther from "@/components/DialogOther.vue";
import data from "../assets/helpers/data.ts";

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
const showDialogOther = ref(false);
const showDialogQrCode = ref(false);
const showDialogConstruction = ref(false);
const tillConstruction = ref('');
const messageConstruction = ref('');
const showDialogConfig = ref(false);
const chosenOS = ref(null);
const chosenClient = ref(null);

onMounted(()=>{
	if (window.screen.width <= 1023) {
		initSwiperData();
		window.addEventListener('resize', initSwiperData);

		chartScroll.value.scrollLeft += 1000;
	}

	if (window.screen.width <= 767) {
		initSwiperDirections();
		window.addEventListener('resize', initSwiperDirections);

		chartScroll.value.scrollLeft += 1000;
	}
})

const initSwiperData = () => {
	const deviceSwiper = new Swiper('.profile__data', {
		slidesPerView: "auto",
		spaceBetween: 0,
		loop: false,
		allowTouchMove: window.screen.width <= 1023,
	});
}

const initSwiperDirections = () => {
	const deviceSwiper = new Swiper('.profile__directions-cards', {
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

const handle503 = (error) => {
	if (error.response.status === 503) {
		const till = new Date(error.response.data.till);
		const tillDate = till.toLocaleDateString('ru');
		const tillHours = till.getHours();
		const tillMinutes = till.getMinutes();
		tillConstruction.value = `${tillDate} ${tillHours}:${tillMinutes}`
		messageConstruction.value = error.response.data.message
		showDialogConstruction.value = true;
	}
}

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
		handle503(error);
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
		handle503(error);
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
		handle503(error);
	}).finally(() => {
		loadingService.hide();
	});

	buttonAddUser = ref(null);
	firstUserProfileCard = ref(null);
	secondUserProfileCard = ref(null);
	searchButton = ref(null);
}

getToken();

const addUser = async () => {
	loadingService.show();
	await axios.post(`${apiLink}/user`, {}, {
			responseType: 'application/json',
			headers: {
				'accept': 'application/json'
			}
		}).then((r) => {
			userData.value = JSON.parse(r.data);
			getUsers();
		}).catch(async (error) => {
			handle503(error);
			if (error.response.status === 401) {
				await getToken();
				addUser();
			} else {
				isError.value = true;
				console.error(error);
			}
		}).finally(() => {
			loadingService.hide();
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
			handle503(error);
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

const addUserHandler = async () => {
	await addUser();
	openDialogQrCodeHandler('linux');
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

const returnToOthersHandler = () => {
	showDialogQrCode.value = !showDialogQrCode.value;
	showDialogOther.value = true;
}

const toggleDialogOtherHandler = () => {
	showDialogOther.value = !showDialogOther.value;
};

const openDialogUser = (id) => {
	deletedUserId.value = id;
	showDialogUser.value = true
};

const toggleDialogOsHandler = () => {
	showDialogOther.value = false;
	showDialogOs.value = !showDialogOs.value;
};

const closeDialogQrCodeHandler = () => {
	showDialogQrCode.value = !showDialogQrCode.value;
};

const configName = ref('');

const openDialogQrCodeHandler = (type) => {
	const osType = typeof type === 'string' ? type : type.value;
	chosenOS.value = osType;
	const configList = require('../../vpn_sistems_config.json');
	const configType = configList.system_defaults[osType];
	configName.value = configType;
	if (osType === 'other') {
		showDialogOs.value = !showDialogOs.value;
		showDialogOther.value = !showDialogOther.value;
	} else {
		titleDialogQrCode.value = osType;
		showDialogOther.value = false;
		showDialogQrCode.value = !showDialogQrCode.value;
	}
};

const togleDialogConfigHandler = () => {
	showDialogConfig.value = !showDialogConfig.value;
};

const switchDialogConfigHandler = (configType) => {
	toggleDialogOtherHandler()
	togleDialogConfigHandler();
	if (configType) {
		chosenClient.value = configType.value;
	}
}

const skipDialogConfig = () => {
	showDialogOs.value = !showDialogOs.value;
	toggleDialogOtherHandler()
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
