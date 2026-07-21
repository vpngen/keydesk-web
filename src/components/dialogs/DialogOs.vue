<template>
	<div class="popup">
		<div class="popup__overlay" @click="close" />
		<div class="popup__alert">
			<div class="popup__close" @click="close">
				<SvgIcon name="icon-close" />
			</div>
			<div class="popup__title">
				{{ t('cabinet.dialogOs.title') }}
			</div>
			<div class="popup__cards">
				<div class="popup__card" v-for="card in cards" :key="card.value" :class="{ 'is-active': cardOs === card.value }" @click="selectCard(card.value)">
					<div class="popup__card-icon">
						<SvgIcon :name="`icon-0${card.value}`" />
					</div>
					<div class="popup__card-text">
						{{ t(`cabinet.osLabels.${card.value}`) }}
					</div>
				</div>
			</div>
			<div class="popup__buttons popup__buttons--os">
				<button class="button button--option2 popup__action os-button os-color" type="button" @click="next">
					<span>{{ t('cabinet.dialogOs.next') }}</span>
				</button>
				<button class="button button--option2 popup__action no-border os-button" type="button" @click="skip">
					<span>{{ t('cabinet.dialogOs.skip') }}</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { dialogOsCards as cards } from '@/const/dialog.ts';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
