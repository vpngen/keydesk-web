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
import {ref, watchEffect} from "vue";
import LeaderLine from "leader-line-new";

const emit = defineEmits(['close']);
const startLine = ref(null);
const endLine = ref(null);
const line = ref(null);
const secondLine = ref(null);

const setLine = () => {
	if (!startLine || !endLine) return
	if (line.value) {
		line.value.remove();
	}
	if (secondLine.value) {
		secondLine.value.remove();
	}

	line.value = new LeaderLine(
			startLine.value,
			LeaderLine.pointAnchor(endLine.value, {x: '100%', y: '83%'}),
			{dash: true, color: 'white', size: 2, positionByWindowResize: false}).setOptions({endSocket: 'right', startSocket: 'bottom'});
	secondLine.value = new LeaderLine(
				startLine.value,
				endLine.value,
				{dash: true, color: 'white', size: 2, positionByWindowResize: false}).setOptions({endSocket: 'bottom', startSocket: 'top'});
}

watchEffect(() => {
	setTimeout(() => {  setLine()}, 100)
})

const highlight = () => {
	emit('highlight');
}

const close = () => {
  emit('close');
	line.value.remove();
	secondLine.value.remove();
};

const triggerStepFour = () => {
  emit('triggerStepFour');
	line.value.remove();
	secondLine.value.remove();
	highlight();
};

</script>