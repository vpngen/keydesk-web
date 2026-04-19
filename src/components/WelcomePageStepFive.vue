<template>
	<div class="popup popup--welcome">
		<div class="popup__overlay welcome" />
		<div class="popup__alert welcome-delete" ref="startLine">
			<div class="popup__title save-title">
				{{ t('cabinet.welcome.step5.line1') }}
			</div>
			<div class="popup__title save-title red">
				{{ t('cabinet.welcome.step5.warning') }}<br>¯\_(ツ)_/¯
			</div>
			<div class="popup__title save-title">
				{{ t('cabinet.welcome.step5.line3') }}
			</div>
			<div class="popup__button welcome-delete">
				<button class="button button--welcome" type="button" @click="triggerStepSix">{{ t('cabinet.welcome.common.next') }}</button>
			</div>
		</div>
		<div class="popup__text welcome bottom-close top">
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
const { applySizePositionOptions, firstLine, secondLine, thirdLine } = generateLines(startLine, endLine,
		{endSocket: 'bottom'},
		{startSocket: 'top'},
		{startSocket: 'bottom'},
		{x: '20%', y: '100%'});

watchEffect(() => {
	applySizePositionOptions(endLine, props.buttonPosition)
})

const emit = defineEmits(['highlight', 'close']);

const triggerStepSix = () => {
	emit('triggerStepSix');
	emit('darkenElements');
	firstLine.value.remove();
	secondLine.value.remove();
	thirdLine.value.remove();
	emit('highlight');
};

const close = () => {
	emit('close');
	emit('darkenElements');
	firstLine.value.remove();
	secondLine.value.remove();
	thirdLine.value.remove();
};
</script>
