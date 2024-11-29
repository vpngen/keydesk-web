<template>
	<div class="header__message" @click="toggle">
		<div class="header__message-close">
			<SvgIcon name="icon-close" />
		</div>
		<div class="header__message-icon">
			<SvgIcon name="icon-logo-impotant" />
		</div>
		<div class="header__message-description">
			<div class="header__message-title">{{ message[0].title }}</div>
			<div class="header__message-text">{{ message[0].text }}</div>
		</div>
	</div>
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
