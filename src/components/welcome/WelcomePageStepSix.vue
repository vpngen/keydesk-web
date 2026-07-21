<template>
	<div class="popup popup--welcome">
		<div class="popup__overlay welcome" />
		<div class="popup__alert welcome-search" ref="startLine">
			<div class="popup__title save-title">
				{{ t('cabinet.welcome.step6.line1') }}
			</div>
			<div class="popup__button welcome-search">
				<button class="button button--welcome" type="button" @click="triggerStepSeven">{{ t('cabinet.welcome.common.next') }}</button>
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
const endLine = ref(null);
const startLine = ref(null);
const {applySizePositionOptions, removeLine} = generateLines(startLine, endLine, {endSocket: 'bottom'});

watchEffect(() => {
	applySizePositionOptions(endLine, props.buttonPosition);
});

const emit = defineEmits(['close']);

const close = () => {
	emit('close');
	emit('darkenElements');
	removeLine();
};

const triggerStepSeven = () => {
	emit('triggerStepSeven');
	emit('darkenElements');
	removeLine();
};

</script>
