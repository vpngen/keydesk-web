<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay(@click="close")
	+e.alert
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
			:image="image"
			fileExt="svg"
			myclass="qr-code"
			:backgroundOptions="{ color: 'transparent' }",
			:cornersSquareOptions="{ type: 'extra-rounded', color: '#1D4365' }",
			:cornersDotOptions="{ type: undefined, color: '#1D4365' }",
		)
		+e.title.qr-title
			| QR code for easy setup on a mobile device
		+e.subtitle
			| Just send it to a friend
		+e.button(v-if="qrCodeBtnShare")
			+e.BUTTON(class="button button--option2 popup__action", @click="share")
				SvgIcon(name="share")
				+e.SPAN
					| Share
		+e.button(v-else)
			+e.BUTTON(class="button button--option2 popup__action", @click="copy")
				+e.button-img
					SvgIcon(name="copy")
				+e.SPAN
					| Сopy data
</template>

<script setup>
import { watchEffect, ref } from "vue";
import QRCodeVue3 from "qrcode-vue3";
import SvgIcon from './SvgIcon.vue';

const props = defineProps({
	file: {
		type: Object
	},
	filename: {
		type: String
	},
});

const qrCodeValue = ref('')

const qrCodeBtnShare = navigator.canShare()

watchEffect(() => {
	if(props.file) {
		props.file.text().then((data) => {
			qrCodeValue.value = data
		})
	}
})

const image = require('@/assets/images/sprites/png/logo-vpn.png')

const share = async () => {
  if (navigator.canShare({ files: [props.file] })) {
    try {
      await navigator.share({
				files: [props.file],
				title: props.filename
			})
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  } else {
    alert(`Your system doesn't support sharing these files.`)
  }
}

const copy = async () => {
	await navigator.clipboard.writeText(qrCodeValue.value);
}

const emit = defineEmits(['close']);

const close = () => {
	emit('close');
};

</script>
