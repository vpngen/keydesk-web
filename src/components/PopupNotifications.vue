<template lang="pug">
include ../assets/pug/base
+b.popup
  +e.overlay.notifications(@click="toggle")
  +e.notifications
    +e.notifications-icon
      SvgIcon(name="icon-logo")
    +e.notifications-title
      | {{ message[0].title }}
    +e.notifications-text
      | {{ message[0].text }}
    +e.notifications-button(@click="toggle")
      +button('Окей', 'button', 'ok', false, false)
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