<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay(@click="close")
	+e.alert
		+e.close(@click="close")
			SvgIcon(name="icon-close")
		+e.name
			| {{ userName }}
		QRCodeVue3(
			:width="500",
			:height="500",
			:qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
			:value="qrCode",
			:imageOptions="{ hideBackgroundDots: true, imageSize: 0.3, margin: 0}",
			:dotsOptions={
				type: 'rounded',
				color: '#1D4365',
			},
			fileExt="svg"
			myclass="qr-code"
			:backgroundOptions="{ color: 'transparent' }",
			:cornersSquareOptions="{ type: 'extra-rounded', color: '#1D4365' }",
			:cornersDotOptions="{ type: undefined, color: '#1D4365' }",
		)
		+e.title.qr-title
			| Конфигурация готова!
		+e.subtitle
			| Скачайте, скопируйте или<br>активируйте ее&nbsp;по&nbsp;QR-коду
			+e.SPAN.tonnel
				| Название туннеля: <b>{{ tonnelName }}</b>
		+e.buttons.qr-buttons
			+e.BUTTON(class="button button--option2 popup__action no-border", @click="copy", v-if="canCopy")
				//- +e.button-img
				//- 	SvgIcon(name="share")
				+e.SPAN
					| Копировать данные
			+e.A(class="button button--option2 popup__action", :href="buttonHref", :download="buttonDownload")
				+e.button-img
					SvgIcon(name="download")
				+e.SPAN
					| Скачать данные
</template>

<script setup>
import { watchEffect, ref } from "vue";
import QRCodeVue3 from "qrcode-vue3";
import SvgIcon from './SvgIcon.vue';

const props = defineProps({
	userData: {
		type: Object
	},
});

const qrCode = ref(new Blob([]))
const userName = ref('');
const tonnelName = ref('');
const buttonHref = ref('');
const buttonDownload = ref('');

// const qrCodeBtnShare = !!navigator.canShare
const canCopy = !!navigator.clipboard

watchEffect(() => {
	if(props.userData) {
		qrCode.value = props.userData.WireguardConfig.FileContent;
		userName.value = props.userData.UserName;
		tonnelName.value = props.userData.WireguardConfig.TonnelName;
		buttonHref.value = window.URL.createObjectURL(new Blob([qrCode.value], {type: 'application/conf'}));
		buttonDownload.value = props.userData.WireguardConfig.FileName;
	}
})

const image = require('@/assets/images/sprites/png/logo-vpn.png')

// const share = async () => {
//   if (navigator.canShare({ files: [props.file] })) {
//     try {
//       await navigator.share({
// 				files: [props.file],
// 				title: props.fileName
// 			})
//     } catch (error) {
//       alert(`Error: ${error.message}`)
//     }
//   } else {
//     alert(`Your system doesn't support sharing these files.`)
//   }
// }

const copy = async () => {
	await navigator.clipboard.writeText(qrCode.value);
}

const emit = defineEmits(['close']);

const close = () => {
	emit('close');
};

</script>
