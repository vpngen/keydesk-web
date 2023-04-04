<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay.welcome
	+e.alert.welcome-congrats
		+e.icon-welcome-congrats
		+e.title.welcome-congrats
			| Теперь ты полноценный повелитель ключницы!
		+e.button.welcome
			+button('Пойду раздавать конфиги', 'button', 'welcome')(@click="emit('close')")
</template>

<script setup>

const emit = defineEmits(['close']);

</script>