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
		+e.subtitle.popup__subtitle--minimize-margin
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
			+e.A(class="button button--option2 popup__action", :href="AmneziaButtonHref", :download="buttonDownloadAmnezia")
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
const amneziaLink = 'https://bit.ly/AmnOther';
const wireguardLink = 'https://bit.ly/WGOther';

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
const userName = ref('');

watchEffect(() => {
	const userConfig = props.userData;
	if (userConfig) {
		WireguardButtonHref.value = window.URL.createObjectURL(new Blob([userConfig.WireguardConfig.FileContent], {type: 'application/conf'}));
		AmneziaButtonHref.value = window.URL.createObjectURL(new Blob([userConfig.AmnzOvcConfig.FileContent], {type: 'application/conf'}));
		userName.value = userConfig.UserName;
		buttonDownloadWireguard.value = userConfig.WireguardConfig.FileName;
		buttonDownloadAmnezia.value = userConfig.AmnzOvcConfig.FileName;
	}
})

const emit = defineEmits(['close']);

const close = () => {
	emit('close');
};

</script>
