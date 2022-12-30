<template lang="pug">
include ../assets/pug/base
include ../assets/pug/data
+b.profile
	+e.headline
		+e.H2.title
			!=`${data.profile.headline.title}{{ usersList.length ? usersList[0].UserName : 'Brigadier' }}`
		+e.search
			+e.search-label
				+e.INPUT.search-input(type="text", placeholder="Поиск", v-model="filterUserText")
			+e.search-button
				+button(data.profile.headline.button, 'button')(@click="addUser")
	+e.cards
		+e.card(v-for="(user, index) in filteredUsers", :key="user.UserID", :class="user.Problems ? 'is-problem' : 'is-active'")
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
			+e.BUTTON.card-button(type="button", v-if="index !== 0" @click="openDialogUser(user.UserID)")
				| Удалить
		+e.add(@click="addUser")
			+e.add-icon
				SvgIcon(name='icon-add')
			+e.P.add-text
				| Добавить<br>пользователя
	+e.data(v-if="false")
		+e.H2.title
			!=data.profile.title
		+e.select
			+e.option
				+button('What data we collect?', 'button', 'option1', false, 1)(:class="dataView ? selectClass : ''", @click="changeDataView")
			+e.option
				+button('FAQ', 'button', 'option2', false, 2)(:class="!dataView ? selectClass : ''", @click="changeDataView")
		+e.tabs
			+e.tab(data-tab="1" v-show="dataView")
				+e.table
					+e.table
						+e.table-head
							+e.table-title
								| Date type
							+e.table-column
								| Brigadir
							+e.table-column
								| User
						each line, index in Array(5)
							+e.table-line
								+e.table-title
									| Date type #[=index + 1]
								+e.table-column
									SvgIcon(name=`icon-status-${index != 1 ? 'on' : 'off'}`)
								+e.table-column
									SvgIcon(name=`icon-status-${index != 1 ? 'off' : 'on'}`)
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
</template>

<script setup>
import { computed, ref } from "vue";
import axios from 'axios';
import SvgIcon from './SvgIcon.vue';
import DialogUser from './DialogUser.vue';
import DialogQrCode from './DialogQrCode.vue';

const selectClass = 'is-select';
let apiLink = '';
if (process.env.NODE_ENV === 'development') {
	apiLink = 'http://static.140.53.88.23.clients.your-server.de';
}
const filterUserText = ref('');

const token = ref(null);
const qrCodeFile = ref(new Blob([]));
const blobLink = ref('');
const usersList = ref([]);
const filename = ref('');
const getUsers = async () => {
	usersList.value = await axios.get(`${apiLink}/user`).then((r) => r.data)
};

(async function () {
    token.value = await axios.post(`${apiLink}/token`).then((r) => r.data.Token);
	if( token.value	) {
		axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
		getUsers();
	}
})();

const addUser = async () => {
	await axios.post(`${apiLink}/user`,{}, {
		responseType: 'blob',
		headers: {
			'accept': 'application/octet-stream'
		}
	}).then((r) => {
		const blob = new Blob([r.data], {type:  r.headers.get('content-type')})

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
	}).catch((error) => {
        console.error(error)
      });
}

const removeUser = async (id) => {
	await axios.delete(`${apiLink}/user/${id}`)
	.then((r) => {
		showDialogUser.value = false;
		deletedUserId.value = null;
	});
	getUsers()
}

const filteredUsers = computed( () => {
	let filter = filterUserText.value
	if (!filter.length) return usersList.value
	return usersList.value.filter( user =>
		user.PersonName.toLowerCase().includes(filter.toLowerCase())
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

</script>
