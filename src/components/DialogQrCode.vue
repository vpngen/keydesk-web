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
			| Отдай ссылку на клиент и {{ resourceType }} другу. Нужно установить {{ vpnName }} и добавить туда {{ resourceType }}
		+e.subtitle
			| Ссылка на клиент:&nbsp;
			+e.SPAN
				+e.A(:href="osLink", target="_blank")
					| {{ osLink }}
		+e.buttons--qr(v-if="props.configName !== 'OutlineConfig'" )
			+e.BUTTON(class="button button--option2 popup__action no-border", @click="others")
				+e.SPAN
					| Другие варианты
			+e.A(class="button button--option2 popup__action", :href="buttonHref", :download="buttonDownload")
				+e.button-img
					SvgIcon(name="download")
				+e.SPAN
					| Скачать данные
		+e.outline-block(v-else)
			+e.outline-header
				| Ссылка конфига:
			+e.outline-link
				+e(ref="outlineLinkRef")
					| {{ outlineLink }}
			+e.buttons--qr
				+e.BUTTON(class="button button--option2 popup__action no-border" @click="others")
					+e.SPAN
						| Другие варианты
				+e.A(
					class="button button--option2 popup__action button__outline"
					:class="{'disabled': !isLinkCopied}"
					@click="copyLink(outlineLinkRef)"
					:disabled="!isLinkCopied")
					+e.button-img
						SvgIcon(name="link")
					+e.SPAN
						| {{ linkButtonText }}
		+e.link-copy-result(v-if="linkCopyResult" :class="{'popup__copy-success':isLinkCopied, 'popup__copy-error':!isLinkCopied}")
			| {{ linkCopyResult }}
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
const outlineLinkRef = ref('');
const userName = ref('');
const tunnelName = ref('');
const buttonHref = ref('');
const buttonDownload = ref('');
const configList = require('../../vpn_sistems_config.json');
const isLinkCopied =ref(true);
const linkCopyResult = ref('');
const linkButtonText = ref('Скопировать');

let showQrCode = ref(false);

// onMounted(()=> {
// 	showQrCode.value = dic.includes(props.title);
// })

const resourceType = computed(() => {
	return props.configName === 'OutlineConfig' ? 'ссылку' : 'файл';
});

const osLabel = computed(() => {
	const osCard = dialogOsCards.find(card => card.value === props.chosenOS.value);
	return osCard ? osCard.label : '';
});

const osLink = computed(() => {
	const chosenConfig = props.configName ? props.configName : 'WireguardConfig';
	return configList.links_defaults[props.chosenOS][chosenConfig] ;
});

const outlineLink = computed(() => {
		return props.configName === 'OutlineConfig' ? props.userData[props.configName].AccessKey : ''
})

const vpnName = computed(() => {
	return configList.vpn_name[props.configName]
})

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

const copyLink = async (target) => {
	if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
		try {
			await navigator.clipboard.writeText(target.innerText);
			isLinkCopied.value = true;
			linkButtonText.value = 'Скопировано'
			linkCopyResult.value = 'Ссылка скопирована в буфер обмена!'
		} catch (error) {
			isLinkCopied.value = false;
			linkCopyResult.value = 'Копирование не поддерживается твоим устройством. Скопируй пожалуйста ссылку ручками:)'
		}
	} else {
		isLinkCopied.value = false;
		linkCopyResult.value = 'Копирование не поддерживается твоим устройством. Скопируй пожалуйста ссылку ручками:)'
	}
}

const emit = defineEmits([
	'close',
	'others'
]);

const close = () => {
	emit('close');
};

const others = () => {
	emit('others');
};

</script>
