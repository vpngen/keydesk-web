<template lang="pug">
include ../assets/pug/base
+b.popup
	+e.overlay(@click="close")
	+e.alert
		+e.close(@click="close")
			SvgIcon(name="icon-close")
		+e.title
			| Выберите тип устройства
		+e.cards
			+e.card(v-for="card in cards",
				:class="{ 'is-active': cardOs === card.value }" @click="selectCard(card.value)")
				+e.card-icon
					SvgIcon(:name="`icon-${card.value}`")
				+e.card-text
					| {{ card.label }}
		+e.buttons--os
			+e.BUTTON(class="button button--option2 popup__action os-button os-color", @click="next")
				+e.SPAN
					| Далее
			+e.BUTTON(class="button button--option2 popup__action no-border os-button", @click="skip")
				+e.SPAN
					| Пропустить
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
