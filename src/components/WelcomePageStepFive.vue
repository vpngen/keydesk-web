<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay.welcome
	+e.alert.welcome-delete(ref='startLine')
		+e.title.save-title
			| Это созданные тобой пользователи. Их можно спокойно удалять, пересоздавать. Твой лимит - 250 конфигураций.
		+e.title.save-title
			| Здесь выводится информация о последнем посещении, лимитах и статусе
		+e.button.welcome-delete
			+button('Далее', 'button', 'welcome')(@click="triggerStepSix")
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

const startLine = ref(null);
const fakeButton = ref(null)
const line = ref(null)
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
			LeaderLine.pointAnchor(fakeButton.value, {x: '20%', y: '100%'}),
			{dash: true, color: 'white', size: 2, positionByWindowResize: false}).setOptions({endSocket: 'bottom'});
	secondLine.value = new LeaderLine(
			fakeButton.value,
			startLine.value,
			{dash: true, color: 'white', size: 2, positionByWindowResize: false}).setOptions({startSocket: 'bottom'});
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

const triggerStepSix = () => {
	emit('triggerStepSix');
	darkenElements();
	line.value.remove();
	secondLine.value.remove();
	highlight();
};

const close = () => {
	emit('close');
	darkenElements();
	line.value.remove();
	secondLine.value.remove();
};
</script>