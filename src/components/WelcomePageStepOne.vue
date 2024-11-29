<template>
	<div class="popup popup--welcome">
		<div class="popup__overlay welcome" />
		<div class="popup__alert welcome">
			<div class="popup__icon-welcome" />
			<div class="popup__title welcome">
				Узнай как пользоваться твоим VPN-сервером
			</div>
			<div class="popup__button welcome">
				<button class="button button--welcome" @click="triggerNextStep">Поехали</button>
			</div>
			<div class="popup__text welcome">
				<a @click="emit('close')">так не интересно, я сам (-а)</a>
			</div>
		</div>
	</div>
</template>

<script setup>
const emit = defineEmits(['triggerNextStep', 'close', 'highlight']);

const triggerNextStep = () => {
	emit('triggerNextStep');
	emit('highlight');
};
</script>
