<template>
	<div class="popup">
		<div class="popup__overlay" @click="close" />
		<div class="popup__alert">
			<div class="popup__close" @click="close">
				<SvgIcon name="icon-close" />
			</div>
			<div class="popup__title">
				Выберите тип устройства
			</div>
			<div class="popup__cards">
				<div class="popup__card" v-for="card in cards" :class="{ 'is-active': cardOs === card.value }" @click="selectCard(card.value)">
					<div class="popup__card-icon">
						<SvgIcon :name="`icon-0{card.value}`" />
					</div>
					<div class="popup__card-text">
						{{ card.label }}
					</div>
				</div>
			</div>
			<div class="popup__buttons popup__buttons--os"></div>
				<button class="button button--option2 popup__action os-button os-color" @click="next">
					<span>Далее</span>
				</button>
				<button class="button button--option2 popup__action no-border os-button" @click="skip">
					<span>Пропустить</span>
				</button>
		</div>
	</div>
</template>

<script setup>
import { watchEffect, ref } from 'vue';
import SvgIcon from './SvgIcon.vue';
import { dialogOsCards as cards } from '../const/dialog.ts';

let cardOs = ref('windows');

const selectCard = (os) => {
	cardOs.value = os;
};

const emit = defineEmits([
	'close',
	'next',
	'skip'
]);

const close = () => {
	emit('close');
};

const next = () => {
	emit('next', cardOs);
};

const skip = () => {
	emit('skip');
};

</script>
