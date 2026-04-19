<template>
	<div class="popup popup--welcome">
		<div class="popup__overlay welcome" />
		<div class="popup__alert welcome">
			<div class="popup__icon-welcome" />
			<div class="popup__title welcome">
				{{ t('cabinet.welcome.step1.title') }}
			</div>
			<div class="popup__button welcome">
				<button class="button button--welcome" type="button" @click="triggerNextStep">{{ t('cabinet.welcome.step1.letsGo') }}</button>
			</div>
			<div class="popup__text welcome">
				<a @click="emit('close')">{{ t('cabinet.welcome.step1.dismiss') }}</a>
			</div>
		</div>
	</div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const emit = defineEmits(['triggerNextStep', 'close', 'highlight']);
const triggerNextStep = () => {
	emit('triggerNextStep');
	emit('highlight');
};
</script>
