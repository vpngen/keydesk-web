<template>
	<div class="notifications">
		<div class="notifications__headline">
			<h2 class="notifications__title">
				{{data.notifications.title}}
				<span v-if="total">{{total}}</span>
			</h2>
			<div class="notifications__filter-block">
				<FiltersPanelNotifications
					:statusList="statusList"
					:selectedFilterSort="selectedFilterSort"
					:selectedFilterStatus="selectedFilterStatus"
					@update:selectedFilterSort="selectedFilterSort = $event"
					@update:selectedFilterStatus="selectedFilterStatus = $event"
				/>
			</div>
		</div>
		<div class="notifications__messages">
			<template v-for="(message, index) in messages" :key="message.id">
				<div
					class="notifications__message"
					:class="{'notifications__message--read': message.is_read,'notifications__message--important': message.priority >= HIGH_PRIORITY}"
					:data-id="message.id"
					:ref="message.id"
					@click="togglePopupHandler"
				>
						<div class="notifications__message-icon">
							<SvgIcon :name="!message.is_read && message.priority >= HIGH_PRIORITY ? 'icon-logo-impotant' : 'icon-logo'"/>
						</div>
						<div class="notifications__message-description">
							<div class="notifications__message-title">
								{{ message.title }}
							</div>
							<div class="notifications__message-date">
								{{ filterDate(message.time) }}
							</div>
							<div class="notifications__message-text">
								{{ message.text.substring(0, 100) }}
							</div>
						</div>
						<div class="notifications__message-button">
							<button class="button button--notifications">Подробнее</button>
						</div>
				</div>
			</template>
			<div class="notifications__message-load" ref="messageLoad" />
		</div>
	</div>
	<PopupNotifications
		v-if="showPopupNotifications"
		:message="messagePopup"
		@toggle="togglePopupHandler"
	/>
</template>

<script setup>
import { ref, inject, computed, watchEffect, watch } from "vue";
import axios from "axios";
import { sortingMap, statusMap } from "@/assets/constants/profileConstants.js";
import SvgIcon from "./SvgIcon.vue";
import FiltersPanelNotifications from "@/components/FiltersPanelNotifications.vue";
import PopupNotifications from "@/components/PopupNotifications.vue";
import data from '@/assets/helpers/data.ts';

let apiLink = "";
if (process.env.NODE_ENV === "development") {
  apiLink = "https://keydesk.ussr.vpngen.org";
}

const messageLimit = ref(10);
const messageStatus = ref('');
const messagePriority = ref('&sort-priority=desc');
const messageTime = ref('');

const HIGH_PRIORITY = 10;

const token = ref(null);
const total = ref(null);
const showPopupNotifications = ref(false);
const messages = ref([]);
const messagePopup = ref([]);
const statusList = ref(['red', 'green']);
const selectedFilterSort = ref(sortingMap.nameDesc);
const selectedFilterStatus = ref(statusMap.all);
const initObserver = ref(false);
const messageLoad = ref(null);

const loadingService = inject("loadingService");

const getToken = async () => {
	loadingService.show();
	await axios.post(`${apiLink}/token`)
		.then((r) => {
			token.value = r.data.Token;
			axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;

			getMessages();
		});
};

getToken();

const getMessages = async () => {
	loadingService.show();
	let url = `${apiLink}/messages?limit=${messageLimit.value}${messageStatus.value}${messagePriority.value}${messageTime.value}`;
	await axios.get(url)
		.then((r) => {
			messages.value = r.data.messages;
			total.value = r.data.total;
		})
		.catch((error) => {
			console.log(error);
		})
		.finally(() => {
			loadingService.hide();

			if (!initObserver.value) {
				useIntersectionObserver();
			}
		});
};

const togglePopupHandler = async (e) => {
  if (!showPopupNotifications.value) {
    const target = e.target.closest(".notifications__message");
    await axios.post(`${apiLink}/messages/${target.dataset.id}/read`);

    messagePopup.value = messages.value.filter((mes) => {
      if (mes.id === target.dataset.id) {
        return true;
      }
    });
  } else {
	getMessages();
  }

  showPopupNotifications.value = !showPopupNotifications.value;
};

const useIntersectionObserver = () => {
	if (messages.value.length === total.value) {
		return;
	}

	initObserver.value = true;

	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach((section) => {
			if (messageLimit.value >= 100 || messages.value.length === total.value) {
				observer.unobserve(messageLoad.value);
			} else if (section.isIntersecting) {
				messageLimit.value += 10;
				getMessages();
			}
		});
	}, {threshold: 1});

	observer.observe(messageLoad.value);
};

const filterDate = (data) => {
	const date = new Date(data);

	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear().toString();

	return `${day}.${month}.${year}`;
};

watch(
	() => selectedFilterSort.value,
	(newVal, oldVal) => {
		switch (newVal) {
			case sortingMap.nameAsc:
				messageTime.value = '';
				messagePriority.value = '&sort-priority=asc';
				break;
			case sortingMap.nameDesc:
				messageTime.value = '';
				messagePriority.value = '&sort-priority=desc';
				break;
			case sortingMap.dateAsc:
				messagePriority.value = '';
				messageTime.value = '&sort-time=asc';
				break;
			case sortingMap.dateDesc:
				messagePriority.value = '';
				messageTime.value = '&sort-time=desc';
				break;
			}

		if (newVal !== oldVal) {
			getMessages();
		}
	}
);

watch(
	() => selectedFilterStatus.value,
	(newVal, oldVal) => {
		switch (newVal) {
			case statusMap.all:
				messageStatus.value = '';
				break;
			case statusMap.green:
				messageStatus.value = '&priority=10&priority-op=ne';
				break;
			case statusMap.red:
				messageStatus.value = '&priority=10&priority-op=eq';
				break;
			}

		if (newVal !== oldVal) {
			getMessages();
		}
	}
);
</script>
