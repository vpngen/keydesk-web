<template>
	<div class="popup">
	  <div class="popup__overlay notifications" @click="toggle" />
	  <div class="popup__notifications">
	    <div class="popup__notifications-icon">
	      <SvgIcon name="icon-logo" />
	    </div>
	    <div class="popup__notifications-title">
	      {{ message[0].title }}
	    </div>
	    <div class="popup__notifications-text">
	      {{ message[0].text }}
	    </div>
	    <div class="popup__notifications-button" @click="toggle">
		    <button class="button button--ok" type="button">{{ t('cabinet.notificationsPage.ok') }}</button>
	    </div>
	  </div>
	</div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

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
