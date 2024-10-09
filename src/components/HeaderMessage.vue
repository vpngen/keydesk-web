<template lang="pug">
include ../assets/pug/base
include ../assets/pug/data
+b.header__message(@click="toggle")
	+e.message-close
		SvgIcon(name="icon-close")
	+e.message-icon
		SvgIcon(name="icon-logo-impotant")
	+e.message-description
		+e.message-title
			| {{ message[0].title }}
		+e.message-text
			| {{ message[0].text }}
</template>

<script setup>
import SvgIcon from './SvgIcon.vue';

const props = defineProps({
	message: {
		type: Array
	},
});

const emit = defineEmits([
	'toggle'
]);

const toggle = () => {
	emit('toggle');
};
</script>
