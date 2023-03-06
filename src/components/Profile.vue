<template lang="pug">
include ../assets/pug/base
include ../assets/pug/data
+b.profile
	+e.headline
		+e.H2.title
			!=`${data.profile.headline.title}{{ usersList?.length ? usersList[0].UserName : 'Brigadier' }}`
		+e.search
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
					@click="addUser"
					:disabled="highlightedElementProperties.buttonAddUser.disabled"
					:class="highlightedElementProperties.buttonAddUser.highlight")
	+e.cards
		+e.card(
			v-for="(user, index) in filteredUsers",
			:key="user.UserID",
			:class="`${user.Problems ? 'is-problem' : 'is-active'} ${highlightedElementProperties[index===0 ? 'firstUserProfileCard' : 'secondUserProfileCard'].highlight}`",
			:ref="user.ref")
			+e.card-headline
				+e.card-logo
					+e.SPAN.card-icon
						SvgIcon(name='icon-card')
				+e.P.card-name
					| {{ user.UserName }}
			+e.UL.card-features
				+e.LI.card-feature(v-if="user.LastVisitHour")
					| #[b Последний визит:]#[span {{ new Date(user.LastVisitHour) }}]
				+e.LI.card-feature(v-if="user.MonthlyQuotaRemainingGB")
					| #[b Лимит трафика:]#[span {{ user.MonthlyQuotaRemainingGB }}Gb]
				+e.LI.card-feature
					| #[b Статус:]#[span(v-if="user.Problems") Problem]
				+e.LI.card-feature(v-if="false")
					| #[b AS:]#[SvgIcon(name='icon-de', v-if="user.LastVisitSubnet")]#[span(v-if="user.LastVisitSubnet") {{ user.LastVisitSubnet }}]
			+e.BUTTON.card-button(
				type="button",
				v-if="index !== 0"
				@click="openDialogUser(user.UserID)"
				:disabled="highlightedElementProperties.secondUserProfileCard.disabled")
				| Удалить
		+e.add(@click="addUser")
			+e.add-icon
				SvgIcon(name='icon-add')
			+e.P.add-text
				| Добавить<br>пользователя
	+e.data
		+e.H2.title
			!=data.profile.title
		+e.select
			+e.option
				+button('Какие данные мы собираем?', 'button', 'option1', false, 1)(:class="dataView ? selectClass : ''", @click="changeDataView")
			+e.option(v-show="false")
				+button('FAQ', 'button', 'option2', false, 2)(:class="!dataView ? selectClass : ''", @click="changeDataView")
		+e.tabs
			+e.tab(data-tab="1" v-show="dataView")
				+e.table
					+e.table
						+e.table-head
							+e.table-title
								| Тип данных
							+e.table-column
								| Brigadir
							+e.table-column
								| User
						each line in data.dataCollection
							+e.table-line
								+e.table-title
									!=line.type
								+e.table-column(data-user=`${line.user}`)(class=`${line.user}`? "tooltip" : "")
									SvgIcon(name=`icon-status-${line.user ? 'on' : 'off'}`)
								+e.table-column(data-user=`${line.brigadier}`)(class=`${line.brigadier}`? "tooltip" : "")
									SvgIcon(name=`icon-status-${line.brigadier ? 'on' : 'off'}`)
			+e.tab(data-tab="2" v-show="!dataView")
				+e.accordion
					+e.accordion-column
						each line, index in Array(3)
							+e.accordion-line
								+e.accordion-question
									| Question №#[=index + 1]
								+e.accordion-responsion
									+e.accordion-content
										| Porta consequat pellentesque maecenas lobortis rhoncus a. Mollis habitasse iaculis purus sit lorem. Suscipit porttitor sed amet leo malesuada. Urna eu quis lorem facilisi dui rhoncus.
										| #[br]#[br]Odio posuere molestie aliquam, faucibus lacus, pharetra, ut non. Posuere turpis elementum egestas turpis nulla. Justo mauris pulvinar rhoncus habitant proin consectetur.
					+e.accordion-column
						each line, index in Array(3)
							+e.accordion-line
								+e.accordion-question
									| Question №#[=index + 4]
								+e.accordion-responsion
									+e.accordion-content
										| Porta consequat pellentesque maecenas lobortis rhoncus a. Mollis habitasse iaculis purus sit lorem. Suscipit porttitor sed amet leo malesuada. Urna eu quis lorem facilisi dui rhoncus.

DialogUser(v-show="showDialogUser" :userId="deletedUserId" @close="closeDialogUser()" @removeUser="removeUser")
DialogQrCode(v-show="showDialogQrCode" :file="qrCodeFile" :fileLink="blobLink" :filename="filename" @close="closeDialogQrCode()")
WelcomePage(
	v-if="!isInstructionHidden"
	@getUsers="getUsers()"
	@toggleDisable="toggleDisableAll"
	@highlightElement="highlightElement"
	@darkenElement="darkenElement"
	@updateValue="updateValue"
	:elementStepTwo="buttonAddUser"
	:elementStepFour="firstUserProfileCard"
	:elementStepFive="secondUserProfileCard"
	:elementStepSix="searchButton"
)

</template>

<script setup>
import {computed, ref} from "vue";
import axios from 'axios';
import SvgIcon from './SvgIcon.vue';
import DialogUser from './DialogUser.vue';
import DialogQrCode from './DialogQrCode.vue';
import WelcomePage from "@/components/WelcomePage.vue";

const buttonAddUser = ref(null);
const firstUserProfileCard = ref(null);
const secondUserProfileCard = ref(null);
const searchButton = ref(null);
const filterUserText = ref('');
const token = ref(null);
const qrCodeFile = ref(new Blob([]));
const blobLink = ref('');
const usersList = ref([]);
const filename = ref('');

const highlightedElementProperties = ref({
	buttonAddUser: {
		disabled: false,
		highlight: '',
		ref:  buttonAddUser,
	},
	firstUserProfileCard: {
		disabled: false,
		highlight: '',
		ref: firstUserProfileCard,
	},
	secondUserProfileCard: {
		disabled: false,
		highlight: '',
		ref: secondUserProfileCard,
	},
	searchButton: {
		disabled: false,
		highlight: '',
		ref: searchButton,
	},
})

const selectClass = 'is-select';
let apiLink = '';
if (process.env.NODE_ENV === 'development') {
	apiLink = 'http://static.140.53.88.23.clients.your-server.de';
}

const isInstructionHidden = ref(true);
const getUsers = async () => {
	usersList.value = await axios.get(`${apiLink}/user`)
	.then((r) => r.data)
	.catch(async (error) => {
		if (error.response.status === 401) {
			await getToken()
			getUsers()
		} else {
			console.error(error)
		}
	});
};

const getToken = async () => {
	await axios.post(`${apiLink}/token`).then((r) => {
		token.value = r.data.Token
		axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;

		isInstructionHidden.value = localStorage.getItem('isInstructionHidden');
		if (isInstructionHidden.value) {
			getUsers();
		} else {
			usersList.value = [{
				"MonthlyQuotaRemainingGB": 100,
				"LastVisitHour": '01.12.22, 15:32',
				"PersonDesc": "За открытие нейтрона",
				"PersonDescLink": "https://ru.wikipedia.org/wiki/%D0%A7%D0%B5%D0%B4%D0%B2%D0%B8%D0%BA,_%D0%94%D0%B6%D0%B5%D0%B9%D0%BC%D1%81",
				"PersonName": "Джеймс Чедвик",
				"Problems": true,
				"UserID": "1613927c-a3ba-433b-b102-499017503122",
				"UserName": "user",
				"ref": "firstUserProfileCard",
			}, {
				"MonthlyQuotaRemainingGB": 100,
				"LastVisitHour": '01.12.22, 15:32',
				"PersonDesc": "За крупный вклад в дело разоружения. Роль: писатель, дипломат, член кабинета министров.",
				"PersonDescLink": "https://ru.wikipedia.org/wiki/%D0%9C%D1%8E%D1%80%D0%B4%D0%B0%D0%BB%D1%8C,_%D0%90%D0%BB%D1%8C%D0%B2%D0%B0",
				"PersonName": "Альва Мюрдаль",
				"Problems": null,
				"UserID": "4f90e7d1-64c6-4209-ae24-c2728d6e3b21",
				"UserName": "Умный Ильич Мечников",
				"ref": "secondUserProfileCard",
			}, {
				"MonthlyQuotaRemainingGB": 100,
				"LastVisitHour": '01.12.22, 15:32',
				"PersonDesc": "В знак признания заслуг в деле мира. Роль: основательницы движения за мир в Северной Ирландии.",
				"PersonDescLink": "https://ru.wikipedia.org/wiki/%D0%A3%D0%B8%D0%BB%D1%8C%D1%8F%D0%BC%D1%81,_%D0%91%D0%B5%D1%82%D1%82%D0%B8",
				"PersonName": "Бетти Уильямс",
				"Problems": true,
				"UserID": "959e5242-daa8-4402-ac6a-0f2cf83c1e68",
				"UserName": "Разный Лев Давыдович",
				"ref": "thirdUserProfileCard",
			}];
		}
	});
}

getToken();

const addUser = async () => {
	await axios.post(`${apiLink}/user`, {}, {
		responseType: 'blob',
		headers: {
			'accept': 'application/octet-stream'
		}
	}).then((r) => {
		const blob = new Blob([r.data], {type: r.headers.get('content-type')})

		qrCodeFile.value = blob
		openDialogQrCode()

		const header = r.headers.get('content-disposition');

		if (header) {
			filename.value = header.split('filename*=')[1].replaceAll(`"`, ``).replace(`utf-8''`, ``).replace(`.conf`, ``);
		} else {
			filename.value = 'config';
		}

		blobLink.value = window.URL.createObjectURL(blob);
		// const link = document.createElement('a');
		// link.href = url;
		// link.setAttribute('download', `${filename.value}.conf`);
		// document.body.appendChild(link);
		// link.click();

		getUsers();
	}).catch(async (error) => {
		if (error.response.status === 401) {
			await getToken()
			addUser()
		} else {
			console.error(error)
		}
	});
}

const removeUser = async (id) => {
	await axios.delete(`${apiLink}/user/${id}`)
			.then((r) => {
				showDialogUser.value = false;
				deletedUserId.value = null;
				getUsers()
			}).catch(async (error) => {
				if (error.response.status === 401) {
					await getToken()
					removeUser(deletedUserId.value)
				} else {
					console.error(error)
				}
			});
}

const filteredUsers = computed(() => {

	let filter = filterUserText.value
	if (!filter.length) return usersList.value
	return usersList.value.filter(user =>
			user.UserName.toLowerCase().includes(filter.toLowerCase())
	)
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

const showDialogQrCode = ref(false);
const closeDialogQrCode = () => {
	showDialogQrCode.value = false;
};

const openDialogQrCode = () => {
	showDialogQrCode.value = true
};

const dataView = ref(true);
const changeDataView = () => {
	dataView.value = !dataView.value
}

const updateValue = () => {
	firstUserProfileCard.value=firstUserProfileCard.value;
	secondUserProfileCard.value=secondUserProfileCard.value;
}

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
