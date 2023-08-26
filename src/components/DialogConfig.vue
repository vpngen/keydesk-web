<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay(@click="close")
	+e.alert
		+e.name
			| {{ userName }}
		+e.close(@click="close")
			SvgIcon(name="icon-close")
		+e.emoji
			SvgIcon(name="icon-emoji-happy")
		+e.title.qr-title
			| Конфигурация готова!
		+e.subtitle.popup__subtitle--minimize-margin
			| Скачай и передай другу подходящий клиент вместе с подходящей конфигурацией.
		+e.subtitle.popup__subtitle--minimize-margin( v-if="hasAmneziaConfig" )
			| Ссылка на клиент AmneziaVPN:&nbsp;
			+e.SPAN
				+e.A(:href="amneziaLink", target="_blank")
					| &nbsp;{{ amneziaLink }}
		+e.subtitle
			| Ссылка на клиент Wireguard:&nbsp;
			+e.SPAN
				+e.A(:href="wireguardLink", target="_blank")
					| &nbsp;{{ wireguardLink }}
		+e.buttons.qr-buttons
			+e.A(class="button button--option2 popup__action", v-if="hasAmneziaConfig" :href="AmneziaButtonHref", :download="buttonDownloadAmnezia")
				+e.button-img
					SvgIcon(name="download")
				+e.SPAN
					| Cloak-файл
			+e.A(class="button button--option2 popup__action", :href="WireguardButtonHref", :download="buttonDownloadWireguard")
				+e.button-img
					SvgIcon(name="download")
				+e.SPAN
					| Wireguard файл
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import SvgIcon from './SvgIcon.vue';
const configList = require('../../vpn_sistems_config.json');
const amneziaLink = configList.links_defaults.other.AmnzOvcConfig;
const wireguardLink = configList.links_defaults.other.WireguardConfig;

const props = defineProps({
	userData: {
		type: Object
	},
	configName: {
		type: String
	}
});

const qrCode = ref(new Blob([]));
const WireguardButtonHref = ref('');
const AmneziaButtonHref = ref('');
const buttonDownloadWireguard = ref('');
const buttonDownloadAmnezia = ref('');
const hasAmneziaConfig = ref(false);
const userName = ref('');

watchEffect(() => {
	const userConfig = props.userData;
	if (userConfig) {
		if ('AmnzOvcConfig' in userConfig) {
			hasAmneziaConfig.value = true;
			AmneziaButtonHref.value = window.URL.createObjectURL(new Blob([userConfig.AmnzOvcConfig.FileContent], {type: 'application/conf'}));
			buttonDownloadAmnezia.value = userConfig.AmnzOvcConfig.FileName;
		};
		WireguardButtonHref.value = window.URL.createObjectURL(new Blob([userConfig.WireguardConfig.FileContent], {type: 'application/conf'}));
		userName.value = userConfig.UserName;
		buttonDownloadWireguard.value = userConfig.WireguardConfig.FileName;
		
	}
})

const emit = defineEmits(['close']);

const close = () => {
	emit('close');
};

</script>
