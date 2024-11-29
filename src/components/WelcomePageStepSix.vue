<template>
	<div class="popup popup--welcome">
		<div class="popup__overlay welcome" />
		<div class="popup__alert welcome-search" ref="startLine">
			<div class="popup__title save-title">
				Здесь можно искать конфигурации по части имени. Пригодится, когда бригада вырастет
			</div>
			<div class="popup__button welcome-search">
				<button class="button button--welcome" @click="triggerStepSeven">Далее</button>
			</div>
		</div>
		<div class="popup__text welcome bottom-close">
			<a @click="close">Пропустить</a>
		</div>
		<div class="popup__fake-area" ref="endLine" />
	</div>
</template>

<script setup>
import {ref, watchEffect} from "vue";
import generateLines from "@/assets/helpers/animations";

const props = defineProps({
	buttonPosition: {
		type: Object
	}
});
const endLine = ref(null);
const startLine = ref(null);
const { applySizePositionOptions, firstLine, secondLine, thirdLine } = generateLines(startLine, endLine,
		{endSocket: 'bottom'},
		{endSocket: 'bottom'},
		{endSocket: 'bottom'});

watchEffect(() => {
	applySizePositionOptions(endLine, props.buttonPosition)
})

const emit = defineEmits(['close']);

const close = () => {
	emit('close');
	emit('darkenElements');
	firstLine.value.remove();
	secondLine.value.remove();
	thirdLine.value.remove();
};

const triggerStepSeven = () => {
	emit('triggerStepSeven');
	emit('darkenElements');
	firstLine.value.remove();
	secondLine.value.remove();
	thirdLine.value.remove();
};

</script>
