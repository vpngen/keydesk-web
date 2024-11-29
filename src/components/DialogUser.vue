<template>
	<div class="popup">
		<div class="popup__overlay" @click="close" />
		<div class="popup__alert" data-alert="delete">
			<div class="popup__icon">
				<SvgIcon name="icon-alert" />
			</div>
			<div class="popup__title">
				Вы уверены что хотите удалить пользователя?
			</div>
			<div class="popup__buttons">
				<div class="popup__button">
					<button class="button button--close" @click="close">Отмена</button>
				</div>
				<div class="popup__button">
					<button class="button button--delete" @click="removeUser">Удалить</button>
				</div>
			</div>
		</div>
		<div class="popup__alert is-hidden" data-alert="access">
			<div class="popup__icon">
				<SvgIcon name="icon-alert" />
			</div>
			<div class="popup__title">
				Вы скачивали слишком много торрент файлов.
			</div>
			<div class="popup__text">
				Доступ будет восстановлен через:
			</div>
			<div class="popup__timer">
				10:00
			</div>
			<div class="popup__button">
				<button class="button button--ok" @click="close">Окей</button>
			</div>
		</div>
	</div>
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
