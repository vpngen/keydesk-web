<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay(@click="close")
	+e.alert
		+e.emoji
			SvgIcon(name="icon-construction")
		+e.title.qr-title
			| У нас технические работы
		+e.subtitle.popup__subtitle--minimize-margin
			| Ожидаемое время их окончания:
		+e.title.qr-title.title-regular
			| {{till}}
		+e.subtitle.popup__subtitle--minimize-margin
			| Так что не беспокойся, скорее всего все под контролем.
		+e.title.qr-title
			| {{message}}
</template>

<script setup>
import SvgIcon from './SvgIcon.vue';

const props = defineProps({
	till: {
		type: String
	},
	message: {
		type: String
	},
});

</script>
