<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay.welcome
	+e.overlay.qr
	+e.alert.welcome-qr(ref="endLine")
		+e.close
			SvgIcon(name="icon-close")
		+e.icon-qr-code
			SvgIcon(name="icon-qr-code")
		+e.title.qr-title
			| Конфигурация готова!
		+e.subtitle.qr-subtitle
			| Скачайте, скопируйте или<br>активируйте ее по QR-коду
		+e.buttons.qr-buttons
			+e.BUTTON(class="button button--option2 popup__action no-border")
				+e.SPAN
					| Копировать данные
			+e.A(class="button button--option2 popup__action")
				+e.button-img
					SvgIcon(name="download")
				+e.SPAN
					| Скачать данные
	+e.alert.welcome-qr-description(ref="startLine")
		+e.title.qr-title-description
			| Конфигурация создана! Скопируй, скачай или открой через QR  данные для нового устройства
		+e.button.welcome
			+button('Далее', 'button', 'welcome')(@click="triggerStepFour")
	+e.text.welcome.bottom-close
		a(@click="close")
			| Пропустить
</template>

<script setup>
import SvgIcon from './SvgIcon.vue';
import {onMounted, ref} from "vue";
import generateLines from "@/assets/helpers/animations";

const emit = defineEmits(['close', 'initElementsContainerData']);
const startLine = ref(null);
const endLine = ref(null);

const { applySizePositionOptions, firstLine, secondLine, thirdLine } = generateLines(startLine, endLine,
		{endSocket: 'right', startSocket: 'bottom'},
		{endSocket: 'bottom', startSocket: 'top'},
		{endSocket: 'bottom', startSocket: 'top'},
		{x: '100%', y: '83%'});

const initElementsContainerData = () => {
	applySizePositionOptions(endLine, endLine);
	window.addEventListener('resize', ()=>applySizePositionOptions(endLine, endLine));
	window.addEventListener('scroll', ()=>applySizePositionOptions(endLine, endLine));
}

onMounted(() => {
	if (endLine.value) {
		initElementsContainerData(endLine.value, endLine.value);
	}
})

const close = () => {
  emit('close');
	firstLine.value.remove();
	secondLine.value.remove();
	thirdLine.value.remove();
};

const triggerStepFour = () => {
  emit('triggerStepFour');
	firstLine.value.remove();
	secondLine.value.remove();
	thirdLine.value.remove();
	emit('highlight');
};

</script>