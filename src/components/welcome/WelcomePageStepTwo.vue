<template>
	<div class="popup popup--welcome">
		<div class="popup__overlay welcome" />
		<div class="popup__alert welcome-save" ref="startLine">
			<div class="popup__title save-title">{{ t('cabinet.welcome.step2.line1') }}</div>
			<div class="popup__title save-title">{{ t('cabinet.welcome.step2.line2') }}</div>
			<div class="popup__button welcome-save">
				<button class="button button--welcome" type="button" @click="triggerStepFive">{{ t('cabinet.welcome.step2.saved') }}</button>
			</div>
		</div>
		<div class="popup__text welcome bottom-close">
			<a @click="close">{{ t('cabinet.welcome.common.skip') }}</a>
		</div>
		<div class="popup__fake-area" ref="endLine" />
	</div>
</template>

<script setup>

import {ref, watchEffect} from "vue";
import {useI18n} from 'vue-i18n';
import generateLines from "@/assets/helpers/animations";

const {t} = useI18n();

const props = defineProps({
	buttonPosition: {
		type: Object
	}
});
const startLine = ref(null);
const endLine = ref(null);
const {applySizePositionOptions, removeLine} = generateLines(startLine, endLine, [
	{endSocket: 'bottom'},
	{endSocket: 'bottom'},
	{endSocket: 'top'},
]);

watchEffect(() => {
	applySizePositionOptions(endLine, props.buttonPosition);
});

const emit = defineEmits(['highlight', 'close']);

const triggerStepFive = () => {
	emit('triggerStepFive');
	emit('darkenElements');
	removeLine();
	emit('highlight');
};

const close = () => {
	emit('close');
	emit('darkenElements');
	removeLine();
};
</script>
