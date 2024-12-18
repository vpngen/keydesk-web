<template>
	<div class="popup">
		<div class="popup__overlay" @click="close" />
		<div class="popup__alert">
			<div class="popup__close" @click="close">
				<SvgIcon name="icon-close" />
			</div>
			<div class="popup__name">
				{{ userName }}
			</div>
			<QRCodeVue3
				v-if="showQrCode"
				:width="500"
				:height="500"
				:qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
				:value="qrCode"
				:imageOptions="{ hideBackgroundDots: true, imageSize: 0.3, margin: 0}"
				:dotsOptions="{
					type: 'rounded',
					color: '#1D4365',
				}"
				fileExt="svg"
				myclass="qr-code"
				:backgroundOptions="{ color: 'transparent' }"
				:cornersSquareOptions="{ type: 'extra-rounded', color: '#1D4365' }"
				:cornersDotOptions="{ type: undefined, color: '#1D4365' }"
			/>
			<div class="popup__emoji" v-else>
				<SvgIcon name="icon-emoji-happy" />
			</div>
			<div class="popup__title qr-title">
				Готово!
			</div>
			<div class="popup__subtitle" v-if="showQrCode">
				Скачайте, скопируйте или<br>активируйте ее&nbsp;по&nbsp;QR-коду
				<span class="tunnel">
					Название туннеля: <b>{{ tunnelName }}</b>
				</span>
			</div>
			<div class="popup__subtitle popup__subtitle--minimize-margin" v-else>
				Поделись с другом ссылкой ниже. Ему нужно перейти по ней и следовать инструкциям.
			</div>
			<!--<div class="popup__subtitle">-->
			<!--	{{ vpnName }}: -->
			<!--	<span>-->
			<!--		<a :href="osLink" target="_blank">{{ osLink }}</a>-->
			<!--	</span>-->
			<!--</div>-->
			<div class="popup__buttons popup__buttons--qr" v-if="props.configName !== 'VPNGenConfig'">
				<button class="button button--option2 popup__action no-border" @click="others">
					<span>Другие варианты</span>
				</button>
				<a class="button button--option2 popup__action" :href="buttonHref" :download="buttonDownload">
					<span class="popup__button-img">
						<SvgIcon name="download" />
					</span>
					<span>Скачать данные</span>
				</a>
			</div>
			<div class="popup__outline-block" v-else>
				<!--<div class="popup__outline-header">Ссылка конфига:</div>-->
				<div class="popup__outline-link" @click="copyText">
					<input ref="outlineLinkRef" :value="outlineLink" readonly="readonly"/>
					<span>
						<SvgIcon name="icon-copy" />
					</span>
					<p v-show="linkCopy">Скопировано</p>
				</div>
				<span class="popup__outline-footer">
					Ты не сможешь сам перейти по этой ссылке под своим VPN, так мы защитили твой ключ от перезаписи
				</span>
				<div class="popup__buttons popup__buttons--qr">
					<button class="popup__button button button--option2" @click="copyText">
						<span>
							<SvgIcon name="link" />
							Копировать ссылку
						</span>
					</button>
					<button v-if="window.location.protocol === 'https:'" class="popup__button button button--option2" @click="share">
						<span>
							<SvgIcon name="icon-share" />
							Поделиться
						</span>
					</button>
				</div>
			</div>
			<div class="popup__link-copy-result" v-if="linkCopyResult" :class="{'popup__copy-success':isLinkCopied, 'popup__copy-error':!isLinkCopied}">
				{{ linkCopyResult }}
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import QRCodeVue3 from 'qrcode-vue3';
import SvgIcon from './SvgIcon.vue';
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
const linkCopy = ref(false);
const showQrCode = ref(false);

const copyText = () => {
	if (linkCopy.value) {
		return;
	}

	linkCopy.value = true;
	const text = outlineLinkRef.value.value;
	const tempElement = document.createElement('textarea');
	tempElement.value = text;
	document.body.appendChild(tempElement);
	tempElement.select();
	document.execCommand('copy');
	document.body.removeChild(tempElement);

	setTimeout(() => {
		linkCopy.value = false;
	}, 2000);
};

const share = () => {
	const shareText = `Перейди по ссылке и следуй инструкциям \n\n${outlineLink.value}`;

	if (navigator.share) {
		navigator.share({
			title: 'Ссылка на инструкцию',
			text: shareText
		})
	} else {
		isLinkCopied.value = false;
		linkCopyResult.value = 'Не поддерживается твоим браузером';
	}
}

const resourceType = computed(() => {
	return props.configName === 'VPNGenConfig' ? 'ссылку' : 'файл';
});

const osLabel = computed(() => {
	const osCard = dialogOsCards.find(card => card.value === props.chosenOS.value);
	return osCard ? osCard.label : '';
});

const osLink = computed(() => {
	const chosenConfig = props.configName ? props.configName : 'WireguardConfig';
	return configList.links_defaults[props.chosenOS][chosenConfig];
});

const outlineLink = computed(() => {
	return props.configName === 'VPNGenConfig' ? props.userData[props.configName] : ''
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
