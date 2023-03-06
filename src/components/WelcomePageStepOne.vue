<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay.welcome
	+e.alert.welcome
		+e.icon-welcome
		+e.title.welcome
			| Узнай как пользоваться твоим VPN-сервером
		+e.button.welcome
			+button('Поехали', 'button', 'welcome')(@click="triggerNextStep")
		+e.text.welcome
			a(@click="close")
				| так не интересно, я сам (-а)
</template>


<script setup>
const emit = defineEmits(['triggerNextStep', 'close', 'highlight']);

const highlight = () => {
	emit('highlight');
}

const triggerNextStep = () => {
	emit('triggerNextStep');
	highlight();
};
const close = () => {
	emit('close');
};

</script>