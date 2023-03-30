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
	+e.text.welcome.bottom-close.top
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