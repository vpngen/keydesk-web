<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay(@click="close")
	+e.alert(data-alert="delete")
		+e.icon
			SvgIcon(name="icon-alert")
		+e.title
			| Вы уверены что хотите удалить пользователя?
		+e.buttons
			+e.button
				+button('Отмена', 'button', 'close')(@click="close")
			+e.button
				+button('Удалить', 'button', 'delete')(@click="removeUser")
	+e.alert.is-hidden(data-alert="access")
		+e.icon
			SvgIcon(name="icon-alert")
		+e.title
			| Вы скачивали слишком много торрент файлов.
		+e.text
			| Доступ будет восстановлен через:
		+e.timer
			| 10:00
		+e.button
			+button('Окей', 'button', 'ok')(@click="close")

</template>
            
<script setup>
import SvgIcon from './SvgIcon.vue';

const props = defineProps({
	userId: {
		type: String
	}
});

const emit = defineEmits(['close', 'removeUser']);

const close = () => {
	emit('close');
};

const removeUser = () => {
	emit('removeUser', props.userId);
};

</script>
