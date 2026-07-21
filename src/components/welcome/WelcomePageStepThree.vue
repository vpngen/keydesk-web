<template>
	<div class="popup popup--welcome">
	  <div class="popup__overlay welcome" />
	  <div class="popup__alert welcome-add" ref="startLine">
	    <div class="popup__title save-title welcome-add">
				{{ t('cabinet.welcome.step3.line1') }}<br>
	      {{ t('cabinet.welcome.step3.line2') }}
	    </div>
	    <div class="popup__button welcome">
		    <button class="button button--welcome" type="button" @click="triggerStepThree">{{ t('cabinet.welcome.common.next') }}</button>
	    </div>
	  </div>
	  <div class="popup__fake-area" ref="endLine" />
	  <div class="popup__text welcome bottom-close">
		  <a @click="close">{{ t('cabinet.welcome.common.skip') }}</a>
	  </div>
	</div>
</template>

<script setup>

import {ref, watchEffect} from "vue";
import {useI18n} from 'vue-i18n';
import generateLines from "@/assets/helpers/animations";

const {t} = useI18n();

const props = defineProps({
  buttonPosition: {
    type: Object
  }
});
const startLine = ref(null);
const endLine = ref(null);
const {applySizePositionOptions, removeLine} = generateLines(startLine, endLine, {endSocket: 'bottom'});

watchEffect(() => {
	applySizePositionOptions(endLine, props.buttonPosition);
});

const emit = defineEmits(['close']);

const close = () => {
	emit('close');
	removeLine();
	emit('darkenElements');
};

const triggerStepThree = () => {
	emit('triggerStepThree');
	removeLine();
	emit('darkenElements');
};
</script>
