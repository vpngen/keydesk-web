<template lang="pug">
include ../assets/pug/base
include ../assets/pug/data
+b.profile
	+e.headline
		+e.H2.title
			!=`${data.profile.headline.title}{{ usersList.length ? usersList[0].PersonName : 'Brigadier' }}` 
		+e.search
			+e.search-label
				+e.INPUT.search-input(type="text", placeholder="Search", v-model="filterUserText")
			+e.search-button
				+button(data.profile.headline.button, 'button')(@click="addUser")
	+e.cards
		+e.card(v-for="user in filteredUsers", :key="user.UserID", :class="user.Problems ? 'is-problem' : 'is-active'")
			+e.card-headline
				+e.card-logo
					+e.SPAN.card-icon
						SvgIcon(name='icon-card')
				+e.P.card-name
					| {{ user.UserName }}
			+e.UL.card-features
				+e.LI.card-feature(v-if="user.LastVisitHour")
					| #[b Last visit:]#[span {{ new Date(user.LastVisitHour) }}]
				+e.LI.card-feature(v-if="user.MonthlyQuotaRemainingGB")
					| #[b Traffic limits:]#[span {{ user.MonthlyQuotaRemainingGB }}Gb]
				+e.LI.card-feature
					| #[b Status:]#[span(v-if="user.Problems") Problem]
				+e.LI.card-feature
					| #[b AS:]#[SvgIcon(name='icon-de', v-if="user.LastVisitSubnet")]#[span(v-if="user.LastVisitSubnet") {{ user.LastVisitSubnet }}]
			+e.BUTTON.card-button(type="button", @click="openDialog(user.UserID)")
				| Delete
		+e.add(@click="addUser")
			+e.add-icon
				SvgIcon(name='icon-add')
			+e.P.add-text
				| Add new
	+e.data
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
  
DialogUser(v-show="showDialog" :userId="deletedUserId" @close="closeDialog" @removeUser="removeUser")
</template>

<script setup>
import { computed, ref } from "vue";
import axios from 'axios';
import SvgIcon from './SvgIcon.vue';
import DialogUser from './DialogUser.vue';

const selectClass = 'is-select';
const filterUserText = ref('')

const token = ref(null);
const usersList = ref(
	[
		// {
		// 	"LastVisitHour": "0001-01-01T00:00:00.000Z",
		// 	"MonthlyQuotaRemainingGB": 100,
		// 	"PersonDesc": "За изобретение эффективных синих светодиодов, приведших к появлению ярких и энергосберегающих источников белого света",
		// 	"PersonDescLink": "https://ru.wikipedia.org/wiki/%D0%90%D0%BA%D0%B0%D1%81%D0%B0%D0%BA%D0%B8,_%D0%98%D1%81%D0%B0%D0%BC%D1%83",
		// 	"PersonName": "Исаму Акасаки",
		// 	"Problems": true,
		// 	"ThrottlingTill": "0001-01-01T00:00:00.000Z",
		// 	"UserID": "b3244822-0f32-439f-b9a1-07187690452d",
		// 	"UserName": "Образцовый Исаму Акасаки"
		// },
		// {
		// 	"LastVisitHour": "0001-01-01T00:00:00.000Z",
		// 	"MonthlyQuotaRemainingGB": 100,
		// 	"PersonDesc": "За открытие новых продуктивных форм атомной теории",
		// 	"PersonDescLink": "https://ru.wikipedia.org/wiki/%D0%94%D0%B8%D1%80%D0%B0%D0%BA,_%D0%9F%D0%BE%D0%BB%D1%8C_%D0%90%D0%B4%D1%80%D0%B8%D0%B5%D0%BD_%D0%9C%D0%BE%D1%80%D0%B8%D1%81",
		// 	"PersonName": "Поль Дирак",
		// 	"Problems": null,
		// 	"ThrottlingTill": "0001-01-01T00:00:00.000Z",
		// 	"UserID": "ff58f9c4-7c84-46d9-8a2e-8b58b96a5aac",
		// 	"UserName": "Пронзительный Поль Дирак"
		// }
	]
);
const getUsers = async () => {
	usersList.value = await axios.get('/user').then((r) => r.data)
};

(async function () {
    token.value = await axios.post('/token').then((r) => r.data.Token);
	if( token.value	) {
		axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
		getUsers();
	}
})();

// const dec2hex = (dec) => {
//   return dec.toString(16).padStart(2, "0")
// }
// const generateId = () => {
//   var arr = new Uint8Array(20)
//   window.crypto.getRandomValues(arr)
//   return Array.from(arr, dec2hex).join('')
// }

const addUser = async () => {
	await axios.post('/user', {}, {
		responseType: 'blob',
	}).then((r) => {
		console.log(r);
		const url = window.URL.createObjectURL(new Blob([r.data]));
        const link = document.createElement('a');
        link.href = url;
		let header = r.headers.get('content-disposition');
		let filename =  header.split('filename*=')[1].replaceAll(`"`, ``).replace(`utf-8''`, ``);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
		getUsers();
	}).catch((error) => {
        console.error(error)
      });
	
	// let user = {
	// 	"LastVisitASCountry": "RU",
	// 	"LastVisitASName": "test",
	// 	"LastVisitHour": Date.now(),
	// 	"LastVisitSubnet": "string",
	// 	"MonthlyQuotaRemainingGB": Math.random(100),
	// 	"PersonDesc": "string",
	// 	"PersonDescLink": "string",
	// 	"PersonName": `Test${generateId()}`,
	// 	"Problems": [
	// 	"no problems"
	// 	],
	// 	"ThrottlingTill": "2022-11-04T09:42:21.094Z",
	// 	"UserID": generateId(),
	// 	"UserName": `Test${Math.random(100)}`
	// };
	
	// usersList.value.push(user);
}

const removeUser = async (id) => {
	await axios.delete(`/user/${id}`).then((r) => console.log(r));
	getUsers()
	// usersList.value = usersList.value.filter((item) => {
	// 	return item.UserID !== id
	// })
	// showDialog.value = false;
	// deletedUserId.value = null;
}

const filteredUsers = computed( () => {
	let filter = filterUserText.value
	if (!filter.length) return usersList.value
	return usersList.value.filter( user => 
		user.PersonName.toLowerCase().includes(filter.toLowerCase())
	)
})

const showDialog = ref(false);
const deletedUserId = ref(null);
const closeDialog = () => {
	showDialog.value = false;
};
const openDialog = (id) => {
	deletedUserId.value = id;
	showDialog.value = true
};

const dataView = ref(true);
const changeDataView = () => {
	dataView.value = !dataView.value
}

</script>
  