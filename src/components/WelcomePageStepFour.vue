<template>
	<div class="popup popup--welcome">
		<div class="popup__overlay welcome" />
		<div class="popup__overlay qr"/>
		<div class="popup__alert welcome-qr" ref="endLine">
			<div class="popup__close">
				<SvgIcon name="icon-close" />
			</div>
			<div class="popup__icon-qr-code">
				<SvgIcon name="icon-qr-code" />
			</div>
			<div class="popup__title qr-title">
				Конфигурация готова!
			</div>
			<div class="popup__subtitle qr-subtitle">
				Скачайте, скопируйте или<br>активируйте ее по QR-коду
			</div>
			<div class="popup__buttons qr-buttons">
				<button class="popup__button button--option2 popup__action no-border">
					<span>Копировать данные</span>
				</button>
				<a class="popup__button button--option2 popup__action">
					<span class="popup__button-img">
						<SvgIcon name="download" />
					</span>
					<span>Скачать данные</span>
				</a>
			</div>
		</div>
		<div class="popup__alert welcome-qr-description" ref="startLine">
			<div class="popup__title qr-title-description">
				Конфигурация создана! Скопируй, скачай или открой через QR  данные для нового устройства
			</div>
			<div class="popup__button welcome">
				<button class="button button--welcome" @click="triggerStepFour">Далее</button>
			</div>
		</div>
		<div class="popup__text welcome bottom-close">
			<a @click="close">
				Пропустить
			</a>
		</div>
	</div>
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
