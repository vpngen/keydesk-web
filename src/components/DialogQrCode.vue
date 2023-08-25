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
			v-if="showQrCode"
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
		+e.emoji(v-else)
			SvgIcon(name="icon-emoji-happy")
		+e.title.qr-title
			| Конфиг для {{ osLabel }} готов!
		+e.subtitle(v-if="showQrCode")
			| Скачайте, скопируйте или<br>активируйте ее&nbsp;по&nbsp;QR-коду
			+e.SPAN.tunnel
				| Название туннеля: <b>{{ tunnelName }}</b>
		+e.subtitle.popup__subtitle--minimize-margin(v-else)
			| Отдай ссылку на клиент и файл другу. Нужно установить WireGuard и добавить туда файл
		+e.subtitle
			| Ссылка на клиент:&nbsp;
			+e.SPAN
				+e.A(:href="osLink", target="_blank")
					| {{ osLink }}
		+e.buttons--qr
			+e.BUTTON(class="button button--option2 popup__action no-border", @click="copy")
				+e.SPAN
					| Копировать данные
			+e.A(class="button button--option2 popup__action", :href="buttonHref", :download="buttonDownload")
				+e.button-img
					SvgIcon(name="download")
				+e.SPAN
					| Скачать данные
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import QRCodeVue3 from 'qrcode-vue3';
import SvgIcon from './SvgIcon.vue';
// import { dialogQrDic as dic } from '../const/dialog.ts';
import { dialogOsCards } from '../const/dialog.ts';

const props = defineProps({
	userData: {
		type: Object
	},
	title: {
		type: String
	},
	configName: {
		type: String
	},
	chosenOS: {
		type: String
	}
});

const qrCode = ref(new Blob([]))
const userName = ref('');
const tunnelName = ref('');
const buttonHref = ref('');
const buttonDownload = ref('');

let showQrCode = ref(false);

// onMounted(()=> {
// 	showQrCode.value = dic.includes(props.title);
// })

const osLabel = computed(() => {
	const osCard = dialogOsCards.find(card => card.value === props.chosenOS.value);
	return osCard ? osCard.label : '';
});

const osLink = computed(() => {
	const osCard = dialogOsCards.find(card => card.value === props.chosenOS.value);
	return osCard ? osCard.link : '';
});

watchEffect(() => {
	const userConfig = props.userData;
	if (userConfig) {
		qrCode.value = userConfig[props.configName].FileContent;
		userName.value = userConfig.UserName;
		tunnelName.value = userConfig[props.configName].TonnelName;
		buttonHref.value = window.URL.createObjectURL(new Blob([qrCode.value], {type: 'application/conf'}));
		buttonDownload.value = userConfig[props.configName].FileName;
	}
});

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

const emit = defineEmits([
	'close',
	'next'
]);

const next = () => {
	emit('next');
};

const close = () => {
	emit('close');
};

</script>
