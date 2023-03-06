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
	+e.fake-area(ref='fakeButton')
</template>

<script setup>
import {ref, watchEffect} from "vue";
import LeaderLine from "leader-line-new";

const props = defineProps({
	buttonPosition: {
		type: Object
	}
});
const fakeButton = ref(null)
const line = ref(null)
const startLine = ref(null);
const secondLine = ref(null);

const setLine = () => {
	if (!startLine || !fakeButton) return
	if (line.value) {
		line.value.remove();
	}
	if (secondLine.value) {
		secondLine.value.remove();
	}

	line.value = new LeaderLine(
			startLine.value,
			fakeButton.value,
			{dash: true, color: 'white', size: 2, positionByWindowResize: false}).setOptions({endSocket: 'bottom'});
	secondLine.value = new LeaderLine(
			startLine.value,
			fakeButton.value,
			{dash: true, color: 'white', size: 2, positionByWindowResize: false}).setOptions({endSocket: 'bottom'});
}

const applySizePositionOptions = (ref, position) => {
	if (!position || !ref.value) {
		return
	}
	ref.value.style.width = `${position.width}px`;
	ref.value.style.top = `${position.top}px`;
	ref.value.style.left = `${position.left}px`;
	ref.value.style.height = `${position.height}px`;

	setTimeout(() => {  setLine()}, 100)
}

watchEffect(() => {
	applySizePositionOptions(fakeButton, props.buttonPosition)
})

const emit = defineEmits(['highlight', 'close']);

const highlight = () => {
	emit('highlight');
};

const darkenElements = () => {
	emit('darkenElements');
};
const close = () => {
	emit('close');
	darkenElements();
	line.value.remove();
	secondLine.value.remove();
};

const triggerStepSeven = () => {
	emit('triggerStepSeven');
	darkenElements();
	line.value.remove();
	secondLine.value.remove();
};

</script>