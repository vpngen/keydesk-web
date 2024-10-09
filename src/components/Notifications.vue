<template lang="pug">
include ../assets/pug/base
include ../assets/pug/data
+b.notifications
	+e.headline
		+e.H2.title
			!=data.notifications.title
			+e.SPAN(v-if="total") ({{ total }})
		+e.filter-block
			FiltersPanelNotifications(
				:statusList="statusList",
				:selectedFilterSort="selectedFilterSort",
				:selectedFilterStatus="selectedFilterStatus",
				@update:selectedFilterSort="selectedFilterSort = $event",
				@update:selectedFilterStatus="selectedFilterStatus = $event")
	+e.messages
		+e.message(
			v-for="(message, index) in messages",
			:key="message.id",
			:ref="message.id",
			:data-id="message.id",
			:class="message.is_read ? 'notifications__message--read': message.priority >= HIGH_PRIORITY ? 'notifications__message--important' : ''"
			@click="togglePopupHandler")
			+e.message-icon
				SvgIcon(:name="!message.is_read && message.priority >= HIGH_PRIORITY ? 'icon-logo-impotant' : 'icon-logo'")
			+e.message-description
				+e.message-title
					| {{ message.title }}
				+e.message-date
					| {{ filterDate(message.time) }}
				+e.message-text
					| {{ message.text.substring(0, 100) }}
			+e.message-button
				+button('Подробнее', 'button', 'notifications', false, false)
		+e.message-load(ref="messageLoad")

PopupNotifications(
	v-if="showPopupNotifications"
	:message="messagePopup"
	@toggle="togglePopupHandler"
)
</template>

<script setup>
import { ref, inject, computed, watchEffect, watch } from "vue";
import axios from "axios";
import { sortingMap, statusMap } from "@/assets/constants/profileConstants.js";
import SvgIcon from "./SvgIcon.vue";
import FiltersPanelNotifications from "@/components/FiltersPanelNotifications.vue";
import PopupNotifications from "@/components/PopupNotifications.vue";

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
