<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay(@click="close")
	+e.alert
		+e.close(@click="close")
			SvgIcon(name="icon-close")
		QRCodeVue3(
			:width="500",
			:height="500",
			:qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
			:value="qrCodeValue",
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
			| Скачайте, скопируйте или<br>активируйте ее по QR-коду
		+e.buttons.qr-buttons
			+e.BUTTON(class="button button--option2 popup__action no-border", @click="copy", v-if="canCopy")
				//- +e.button-img
				//- 	SvgIcon(name="share")
				+e.SPAN
					| Копировать данные
			+e.A(class="button button--option2 popup__action", :href="fileLink", :download="`${filename}.conf`")
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
	file: {
		type: Object
	},
	fileLink: {
		type: String
	},
	filename: {
		type: String
	},
});

const qrCodeValue = ref('')

// const qrCodeBtnShare = !!navigator.canShare
const canCopy = !!navigator.clipboard

watchEffect(() => {
	if(props.file) {
		props.file.text().then((data) => {
			qrCodeValue.value = data
		})
	}
})

const image = require('@/assets/images/sprites/png/logo-vpn.png')

// const share = async () => {
//   if (navigator.canShare({ files: [props.file] })) {
//     try {
//       await navigator.share({
// 				files: [props.file],
// 				title: props.filename
// 			})
//     } catch (error) {
//       alert(`Error: ${error.message}`)
//     }
//   } else {
//     alert(`Your system doesn't support sharing these files.`)
//   }
// }

const copy = async () => {
	await navigator.clipboard.writeText(qrCodeValue.value);
}

const emit = defineEmits(['close']);

const close = () => {
	emit('close');
};

</script>
