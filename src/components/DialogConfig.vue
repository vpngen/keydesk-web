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
			| {{ clientLabel }}-конфиг готов!
		+e.subtitle.popup__subtitle--minimize-margin
			| Отдай ссылку на клиент и {{ downloadLabel }} другу. Нужно установить {{ displayedClientName }} и добавить туда {{ downloadLabel }}
		+e.subtitle
			| Ссылка на клиент:&nbsp
			+e.SPAN
				+e.A(:href="clientLink", target="_blank")
					| &nbsp;{{ clientLink }}
		+e.buttons.qr-buttons(v-if="clientName !== 'outline'")
			+e.A(class="button button--option2 popup__action"  @click="back")
				+e.SPAN
					| Другие варианты
			+e.A(class="button button--option2 popup__action", :href="buttonHref", :download="buttonDownload")
				+e.button-img
					SvgIcon(name="download")
				+e.SPAN
					| Скачать файл
		+e.outline-block(v-else)
			+e.outline-header
				| Ссылка конфига:
			+e.outline-link
				+e(ref="outlineLinkRef")
					| {{ outlineLink }}
			+e.buttons--qr
				+e.BUTTON(class="button button--option2 popup__action no-border" @click="back")
					+e.SPAN
						| Другие варианты
				+e.A(class="button button--option2 popup__action button__outline" :class="{'disabled': !isLinkCopied}" @click="copyLink(outlineLinkRef)" :disabled="!isLinkCopied")
					+e.button-img
						SvgIcon(name="link")
					+e.SPAN
						| {{ linkButtonText }}
		+e.link-copy-result(v-if="linkCopyResult" :class="{'popup__copy-success':isLinkCopied, 'popup__copy-error':!isLinkCopied}")
			| {{ linkCopyResult }}

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
