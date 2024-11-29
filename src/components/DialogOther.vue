<template>
	<div class="popup">
		<div class="popup__overlay" @click="close" />
		<div class="popup__alert">
			<div class="popup__close" @click="close">
				<SvgIcon name="icon-close" />
			</div>
			<div class="popup__title">
				Выберите тип конфига
			</div>
			<div class="popup__cards">
				<div class="popup__card" v-for="card in cards" :class="{ 'is-active': cardType === card.value }" @click="selectCard(card.value)">
					<div class="popup__card-icon card-icon--container">
						<div :class="`icon-0${card.value}`" />
					</div>
					<div class="popup__card-text">
						{{ card.label }}
					</div>
				</div>
			</div>
			<div class="popup__buttons popup__buttons--os">
				<button class="button button--option2 popup__action os-button os-color" @click="next">
					<span>Далее</span>
				</button>
				<button class="button button--option2 popup__action no-border os-button" @click="back">
					<span>Назад</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import SvgIcon from './SvgIcon.vue';
import { dialogOtherCards as cards } from '../const/dialog.ts';

let cardType = ref('amnezia');

const selectCard = (os) => {
	cardType.value = os;
};

const emit = defineEmits([
	'close',
	'next',
	'back'
]);

const close = () => {
	emit('close');
};

const next = () => {
	emit('next', cardType);
};

const back = () => {
	emit('back');
};

</script>
