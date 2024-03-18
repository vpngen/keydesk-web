<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay(@click="close")
	+e.alert
		+e.close(@click="close")
			SvgIcon(name="icon-close")
		+e.title
			| Выберите тип конфига
		+e.cards
			+e.card(v-for="card in cards", :class="{ 'is-active': cardType === card.value }" @click="selectCard(card.value)")
				+e.card-icon(class="card-icon--container")
					+e.DIV(:class="`icon-${card.value}`")
				+e.card-text
					| {{ card.label }}
		+e.buttons--os
			+e.BUTTON(class="button button--option2 popup__action os-button os-color", @click="next")
				+e.SPAN
					| Далее
			+e.BUTTON(class="button button--option2 popup__action no-border os-button", @click="back")
				+e.SPAN
					| Назад
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
