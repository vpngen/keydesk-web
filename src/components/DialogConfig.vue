<template>
	<div class="popup">
		<div class="popup__overlay" @click="close" />
		<div class="popup__alert">
			<div class="popup__name">
				{{ userName }}
			</div>
			<div class="popup__close" @click="close">
				<SvgIcon name="icon-close" />
			</div>
			<div class="popup__emoji">
				<SvgIcon name="icon-emoji-happy" />
			</div>
			<div class="popup__title qr-title">
				{{ clientLabel }}-конфиг готов!
			</div>
			<div class="popup__subtitle popup__subtitle--minimize-margin">
				Отдай ссылку на клиент и {{ downloadLabel }} другу. Нужно установить {{ displayedClientName }} и добавить туда {{ downloadLabel }}
			</div>
			<div class="popup__subtitle">
				Ссылка на клиент:&nbsp
				<span>
					<a :href="clientLink" target="_blank">
						| &nbsp;{{ clientLink }}
					</a>
				</span>
			</div>
			<div class="popup__buttons qr-buttons" v-if="clientName !== 'outline'">
				<a class="button button--option2 popup__action" @click="back">
					<span>Другие варианты</span>
				</a>
				<a class="button button--option2 popup__action" :href="buttonHref" :download="buttonDownload">
					<span class="popup__button-img">
						<SvgIcon name="download" />
					</span>
					<span>Скачать файл</span>
				</a>
			</div>
			<div class="popup__outline-block" v-else>
				<div class="popup__outline-header">
					Ссылка конфига:
				</div>
				<div class="popup__outline-link">
					<div ref="outlineLinkRef">
						{{ outlineLink }}
					</div>
				</div>
				<div class="popup__buttons popup__buttons--qr">
					<button class="button button--option2 popup__action no-border" @click="back">
						<span>Другие варианты</span>
					</button>
					<a class="button button--option2 popup__action button__outline" :class="{'disabled': !isLinkCopied}"
					   @click="copyLink(outlineLinkRef)" :disabled="!isLinkCopied">
						<span class="popup__button-img">
							<SvgIcon name="link" />
						</span>
						<span>
							{{ linkButtonText }}
						</span>
					</a>
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
import SvgIcon from './SvgIcon.vue';
const configList = require('../../vpn_sistems_config.json');
const clientLink = ref();
import { dialogOtherCards as cards } from '../const/dialog.ts';

const props = defineProps({
	userData: {
		type: Object
	},
	clientName: {
		type: String
	}
});

const qrCode = ref(new Blob([]));
const buttonHref = ref('');
const buttonDownload = ref('');
const userName = ref('');
const clientKey =ref(null);
const isLinkCopied =ref(true);
const outlineLinkRef = ref('');
const linkCopyResult = ref('');
const linkButtonText = ref('Скопировать');

const shareConfig = () => {
	const shareText = `Перейди по ссылке и следуй инструкциям ${clientLink.value}, Добавь туда свою конфигурацию ${outlineLink.value}, Инструкция https://docs.google.com/document/d/1QsX0fNUW1XvlSAT2ZMHLC__iPXRTssyQEev4Udhz3hk/edit`

	if (navigator.share) {
		navigator.share({
			title: 'Ссылки на клиент, конфиг, инструкцию',
			text: shareText
		})
	} else {
		navigator.clipboard.writeText('Не поддерживается твоим браузером')
	}
}

const clientLabel = computed(() => {
	const card = cards.find(card => card.value === props.clientName);
	return card ? card.label : '';
});

const downloadLabel = computed(() => {
	return props.clientName === 'outline' ? 'ссылку' : 'файл';
});

const displayedClientName = computed(() => {
	const card = cards.find(card => card.value === props.clientName);
	return card ? card.client : '';
});

const outlineLink = computed(() => {
	return props.clientName === 'outline' ? props.userData[clientKey.value].AccessKey : ''
});

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

watchEffect(() => {
	const userConfig = props.userData;
	if (userConfig) {
			userName.value = userConfig.UserName;

		clientKey.value = configList.system_defaults[props.clientName];

		if (clientKey.value) {
			clientLink.value = configList.links_defaults.other[clientKey.value];
		}

		buttonHref.value = window.URL.createObjectURL(new Blob([userConfig[clientKey.value].FileContent], {type: 'application/conf'}));
		buttonDownload.value = userConfig[clientKey.value].FileName;
	}
})

const emit = defineEmits([
	'close',
	'back'
]);

const close = () => {
	emit('close');
};

const back = () => {
	emit('back');
}

</script>
