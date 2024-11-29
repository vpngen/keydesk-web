<template>
	<div class="popup popup--welcome">
		<div class="popup__overlay welcome" />
		<div class="popup__alert welcome-save" ref="startLine">
			<div class="popup__title save-title">Это аккаунт бригадира. Его можно восстановить только через 6 слов и имя.</div>
			<div class="popup__title save-title">Если ты их не сохранил - сделай это прямо сейчас!</div>
			<div class="popup__button welcome-save">
				<button class="button button--welcome" @click="triggerStepFive">Все, сохранил(-а)!</button>
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
const startLine = ref(null);
const endLine = ref(null);
const { applySizePositionOptions, firstLine, secondLine, thirdLine } = generateLines(startLine, endLine,
		{endSocket: 'bottom'},
		{endSocket: 'bottom'},
		{endSocket: 'top'}
);

watchEffect(() => {
	applySizePositionOptions(endLine, props.buttonPosition)
})

const emit = defineEmits(['highlight', 'close']);

const triggerStepFive = () => {
	emit('triggerStepFive');
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
