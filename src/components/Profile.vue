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
			:class="`${highlightedElementProperties[getRefForHighlight(index)].highlight}`",
			:ref="user.ref")
			+e.card-headline
				+e.card-status(:class="`${user.Status} tooltip`",
					:data-user="`${profileCardStatus.statusHint[user.Status]}`")
				+e.card-logo
					+e.SPAN.card-icon
						SvgIcon(name='icon-card')
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
			+e.option
				+button('FAQ', 'button', 'option2', false, 2)(:class="!dataView ? selectClass : ''", @click="changeDataView")
		+e.tabs
			+e.tab(data-tab="1" v-show="dataView")
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
			+e.tab(data-tab="2" v-show="!dataView")
				ShowMoreList(:isShown="dataView")


DialogUser(v-if="showDialogUser" :userId="deletedUserId" @close="closeDialogUser()" @removeUser="removeUser")
DialogQrCode(v-if="showDialogQrCode" :file="qrCodeFile" :fileLink="blobLink" :filename="filename" @close="closeDialogQrCode()")
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
import {computed, ref} from "vue";
import axios from 'axios';
import SvgIcon from './SvgIcon.vue';
import DialogUser from './DialogUser.vue';
import DialogQrCode from './DialogQrCode.vue';
import WelcomePage from "@/components/WelcomePage.vue";
import ShowMoreList from "@/components/ShowMoreList.vue";
import {mockedDataProfile, profileCardStatus} from '@/assets/constants/profileConstants.js'
import {generateHighlightedElementProperties} from "@/assets/helpers/profileHelpers";
import PopupError from "@/components/PopupError.vue";

let buttonAddUser, firstUserProfileCard, secondUserProfileCard, searchButton;

const filterUserText = ref('');
const token = ref(null);
const qrCodeFile = ref(new Blob([]));
const blobLink = ref('');
const usersList = ref([]);
const filename = ref('');
const isError = ref(false)

const highlightedElementProperties = ref(generateHighlightedElementProperties(buttonAddUser, firstUserProfileCard, secondUserProfileCard, searchButton));

const formattedDate = (data) => {
	const date = new Date(data);

	const day = date.getUTCDate().toString().padStart(2, '0')
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
	const year = date.getUTCFullYear().toString()
	const hours = date.getUTCHours().toString().padStart(2, '0')

	return `${day}.${month}.${year} ~${hours}:00`
}

const selectClass = 'is-select';
let apiLink = '';
if (process.env.NODE_ENV === 'development') {
	apiLink = 'https://keydesk.ussr.vpngen.org';
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
      isError.value = true;
			console.error(error)
		}
	});
};
const getRefForHighlight = (index) => {
	return index===0 ? 'firstUserProfileCard' : 'secondUserProfileCard'
}

const getToken = async () => {
	await axios.post(`${apiLink}/token`).then((r) => {
		token.value = r.data.Token
		axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;

		isInstructionHidden.value = localStorage.getItem('isInstructionHidden');
		if (isInstructionHidden.value) {
			getUsers();
		} else {
			usersList.value = mockedDataProfile;
		}
	});
	buttonAddUser = ref(null);
	firstUserProfileCard = ref(null);
	secondUserProfileCard = ref(null);
	searchButton = ref(null);
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

		getUsers();
	}).catch(async (error) => {
		if (error.response.status === 401) {
			await getToken()
			addUser()
		} else {
			isError.value = true;
			console.error(error)
		}
	});
}

const removeUser = async (id) => {
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
