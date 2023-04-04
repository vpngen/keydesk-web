<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay.welcome
	+e.alert.welcome-save(ref='startLine')
		+e.title.save-title
			| Это аккаунт бригадира. Его можно восстановить только через 6 слов и имя.
		+e.title.save-title
			| Если ты их не сохранил - сделай это прямо сейчас!
		+e.button.welcome-save
			+button('Все, сохранил(-а)!', 'button', 'welcome')(@click="triggerStepFive")
	+e.text.welcome.bottom-close
		a(@click="close")
			| Пропустить
	+e.fake-area(ref='endLine')
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