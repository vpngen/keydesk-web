<template>
	<div class="popup popup--welcome">
		<div class="popup__overlay welcome" />
		<div class="popup__alert welcome-delete" ref="startLine">
			<div class="popup__title save-title">
				Это созданные тобой пользователи. Их можно спокойно удалять, пересоздавать. Твой лимит - 250 конфигураций.
			</div>
			<div class="popup__title save-title">
				Здесь выводится информация о последнем посещении, лимитах и статусе
			</div>
			<div class="popup__button welcome-delete">
				<button class="button button--welcome" @click="triggerStepSix">Далее</button>
			</div>
		</div>
		<div class="popup__text welcome bottom-close top">
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
