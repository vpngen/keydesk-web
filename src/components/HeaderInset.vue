<template lang="pug">
include ../assets/pug/base
include ../assets/pug/data
+b.HEADER.header--inset
	+e.container
		RouterLink(class="header__logo" to="/")
			SvgIcon(name="logo-vpn")
		RouterLink(:class="`header__notifications ${message.length ? 'header__notifications--message' : ''}`" to="/notifications"  :data-total="message.length")
			SvgIcon(name="icon-ring")
		HeaderMessage(
			v-if="showMessage"
			:message="message"
			@toggle="toggleMessage"
		)
		+e.content(v-if="false")
			+e.NAV.nav
				each link in data.headerInset.link
					+e.A.link(href=link.href)
						!=link.text
			+e.language
				+e.BUTTON.lang(type="button", @click="openLangMenu")
					SvgIcon(name="lang-de")
				+e.lang-menu(:class="showLangMenu ? 'active' : ''")
					for item in data.headerInset.langList
						+e.A.lang-item(href=item.href)
							+e.lang-img
								SvgIcon(name=`lang-${item.img}`)
							+e.lang-name
								!=item.lang
			+e.BUTTON.burger(type="button")
				+e.SPAN
				+e.SPAN
				+e.SPAN
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import axios from "axios";
import SvgIcon from './SvgIcon.vue';
import HeaderMessage from "@/components/HeaderMessage.vue";

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

const toggleMessage = async () => {
  if (showMessage.value) {
    await axios.post(`${apiLink}/messages/${message.value[0].id}/read`);

	getMessage();
  }

  showMessage.value = !showMessage.value;
};
</script>
