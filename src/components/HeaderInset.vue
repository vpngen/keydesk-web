<template>
	<header class="header header--inset">
		<div class="header__container">
			<RouterLink class="header__logo" to="/">
				<SvgIcon name="logo-vpn" />
			</RouterLink>
			<div class="header__right">
				<RouterLink :class="`header__notifications ${message.length ? 'header__notifications--message' : ''}`"
					to="/notifications" :data-total="message.length">
					<SvgIcon name="icon-ring" />
				</RouterLink>
				<HeaderMessage v-if="showMessage" :message="message" @toggle="toggleMessage" />
				<div class="header__school">
					<button @click="openSchool" class="header__school-button">
						<div class="header__school-icon">
							<SvgIcon name="book" />
						</div>
						<span>Школа бригадиров</span>
					</button>
				</div>
			</div>
			<div class="header__content" v-if="false">
				<nav class="header__nav">
					<template v-for="link in data.headerInset.link">
						<a :href="link.href" class="header__link">{{ link.text }}</a>
					</template>
					<div class="header__language">
						<button class="header__lang" @click="openLangMenu">
							<SvgIcon name="header__lang-de" />
						</button>
						<div class="header__lang-menu" :class="{ 'active': showLangMenu }">
							<template v-for="item in data.headerInset.langList">
								<a :href="item.href" class="header__lang-item">
									<div class="header__lang-img">
										<SvgIcon :name="`lang-${item.lang}`" />
									</div>
									<span class="header__lang-name">{{ item.lang }}</span>
								</a>
							</template>
						</div>
					</div>
				</nav>
				<button class="header__burger">
					<span />
					<span />
					<span />
				</button>
			</div>

		</div>
	</header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import axios from "axios";
import SvgIcon from './SvgIcon.vue';
import HeaderMessage from "@/components/HeaderMessage.vue";
import data from "@/assets/helpers/data.ts";
import { useUsersStore } from "@/store/users";
import { storeToRefs } from 'pinia';

const usersStore = useUsersStore();
const {usersList} = storeToRefs(usersStore);

let apiLink = "";
if (process.env.NODE_ENV === "development") {
	apiLink = "https://keydesk.ussr.vpngen.org";
}

const token = ref(null);
const message = ref([]);
const showMessage = ref(false);

const getToken = async () => {
	await axios.post(`${apiLink}/token`)
		.then((r) => {
			token.value = r.data.Token;
			axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;

			getMessage();
		});
};

const getMessage = async () => {
	await axios.get(`${apiLink}/messages?read=false&priority=10&priority-op=eq`)
		.then((r) => {
			message.value = r.data.messages;

			if (message.value.length) {
				showMessage.value = !showMessage.value;
			}
		});
};

getToken();

const openSchool = () => {
	let user = 'brigadier';

	if (usersList.value[0]) {
		user = usersList.value[0].UserName
			.replace(/^\d+\s*/, '')
			.replace(/\s+/g, '+')
			.toLowerCase();
	}

	window.open(`https://volunteer-ru.net/authfromvpngen/${user}`, '_blank');
};

const toggleMessage = async () => {
	if (showMessage.value) {
		await axios.post(`${apiLink}/messages/${message.value[0].id}/read`);

		await getMessage();
	}

	showMessage.value = !showMessage.value;
};
</script>
