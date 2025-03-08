<template>
	<div class="popup popup--welcome">
		<div class="popup__overlay welcome" />
		<div class="popup__alert welcome-congrats">
			<div class="popup__icon-welcome-congrats" />
			<div class="popup__title welcome-congrats">
				Теперь ты полноценный повелитель ключницы!
			</div>
			<div class="popup__text">
				Подпишись на наш канал, там интересно!<br><a href="https://t.me/vpngen" target="_blank">VPN Generator</a>
			</div>
			<div class="popup__text">Если вдруг что-то не получится, то обращайся в поддрежку<br>
				<a href="https://t.me/vpngensupportbot" target="_blank">VPN Generator Support</a></div>
			<div class="popup__button welcome">
				<button class="button button--welcome" @click="emit('close')">Пойду раздавать конфиги</button>
			</div>
		</div>
	</div>
</template>

<script setup>

const emit = defineEmits(['close']);

</script>
