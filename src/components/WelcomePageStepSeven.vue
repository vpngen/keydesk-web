<template>
	<div class="popup popup--welcome">
		<div class="popup__overlay welcome" />
		<div class="popup__alert welcome-congrats">
			<div class="popup__icon-welcome-congrats" />
			<div class="popup__title welcome-congrats">
				Теперь ты полноценный повелитель ключницы!
			</div>
			<div class="popup__button welcome">
				<button class="button button--welcome" @click="emit('close')">Пойду раздавать конфиги</button>
			</div>
		</div>
	</div>
</template>

<script setup>

const emit = defineEmits(['close']);

</script>
