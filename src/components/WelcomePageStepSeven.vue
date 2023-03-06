<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay.welcome
	+e.alert.welcome-congrats
		+e.icon-welcome-congrats
		+e.title.welcome-congrats
			| Теперь ты полноценный повелитель ключницы!
		+e.button.welcome
			+button('Пойду раздавать конфиги', 'button', 'welcome')(@click="close")

</template>

<script setup>

const emit = defineEmits(['close']);

const close = () => {
	emit('close');
};

</script>