<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay.welcome
	+e.alert.welcome-search(ref='startLine')
		+e.title.save-title
			| Здесь можно искать конфигурации по части имени. Пригодится, когда бригада вырастет
		+e.button.welcome-search
			+button('Далее', 'button', 'welcome')(@click="triggerStepSeven")
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