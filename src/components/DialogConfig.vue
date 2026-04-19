<template>
	<div class="popup">
		<div class="popup__overlay" @click="close" />
		<div class="popup__alert">
			<div class="popup__name">
				{{ displayName(userName) }}
			</div>
			<div class="popup__close" @click="close">
				<SvgIcon name="icon-close" />
			</div>
			<div class="popup__emoji">
				<SvgIcon name="icon-emoji-happy" />
			</div>
			<div class="popup__title qr-title">
				{{ t('cabinet.dialogConfig.ready', { client: clientLabel }) }}
			</div>
			<div class="popup__subtitle popup__subtitle--minimize-margin">
				{{ giveSubtitle }}
			</div>
			<div class="popup__subtitle">
				{{ t('cabinet.dialogConfig.clientLink') }}&nbsp
				<span>
					<a :href="clientLink" target="_blank">
						| &nbsp;{{ clientLink }}
					</a>
				</span>
			</div>
			<div class="popup__buttons qr-buttons" v-if="clientName !== 'outline'">
				<a class="button button--option2 popup__action" @click="back">
					<span>{{ t('cabinet.dialogConfig.otherOptions') }}</span>
				</a>
				<a class="button button--option2 popup__action" :href="buttonHref" :download="buttonDownload">
					<span class="popup__button-img">
						<SvgIcon name="download" />
					</span>
					<span>{{ t('cabinet.dialogConfig.downloadFile') }}</span>
				</a>
			</div>
			<div class="popup__outline-block" v-else>
				<div class="popup__outline-header">
					{{ t('cabinet.dialogConfig.configLink') }}
				</div>
				<div class="popup__outline-link">
					<div ref="outlineLinkRef">
						{{ outlineLink }}
					</div>
				</div>
				<div class="popup__buttons popup__buttons--qr">
					<button class="button button--option2 popup__action no-border" @click="back">
						<span>{{ t('cabinet.dialogConfig.otherOptions') }}</span>
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
import { useI18n } from 'vue-i18n';
import { useDisplayPersonName } from '@/composables/useDisplayPersonName';
const configList = require('../../vpn_sistems_config.json');
const clientLink = ref();
import { dialogOtherCards as cards } from '../const/dialog.ts';

const { t } = useI18n();
const { displayName } = useDisplayPersonName();

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
const linkJustCopied = ref(false);

const linkButtonText = computed(() =>
	linkJustCopied.value ? t('cabinet.dialogConfig.copied') : t('cabinet.dialogConfig.copy')
);

const shareConfig = () => {
	const shareText = t('cabinet.dialogConfig.shareBundle', {
		clientLink: clientLink.value,
		outline: outlineLink.value,
	});

	if (navigator.share) {
		navigator.share({
			title: t('cabinet.dialogConfig.shareTitle'),
			text: shareText
		})
	} else {
		navigator.clipboard.writeText(t('cabinet.dialogConfig.clipboardUnsupported'))
	}
}

const clientLabel = computed(() => {
	const card = cards.find(card => card.value === props.clientName);
	return card ? card.label : '';
});

const downloadWord = computed(() => {
	return props.clientName === 'outline' ? t('cabinet.dialogQr.resourceLink') : t('cabinet.dialogQr.resourceFile');
});

const displayedClientName = computed(() => {
	const card = cards.find(card => card.value === props.clientName);
	return card ? card.client : '';
});

const giveSubtitle = computed(() =>
	t('cabinet.dialogConfig.give', {
		resource: downloadWord.value,
		app: displayedClientName.value,
	})
);

const outlineLink = computed(() => {
	return props.clientName === 'outline' ? props.userData[clientKey.value].AccessKey : ''
});

const copyLink = async (target) => {
	if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
		try {
			await navigator.clipboard.writeText(target.innerText);
			isLinkCopied.value = true;
			linkJustCopied.value = true;
			linkCopyResult.value = t('cabinet.dialogConfig.copySuccess')
		} catch (error) {
			isLinkCopied.value = false;
			linkCopyResult.value = t('cabinet.dialogConfig.copyFail')
		}
	} else {
		isLinkCopied.value = false;
		linkCopyResult.value = t('cabinet.dialogConfig.copyFail')
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
