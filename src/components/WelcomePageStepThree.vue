<template>
	<div class="popup popup--welcome">
	  <div class="popup__overlay welcome" />
	  <div class="popup__alert welcome-add" ref="startLine">
	    <div class="popup__title save-title welcome-add">
	      Нажмите тут для добавления конфигурации.
	    </div>
	    <div class="popup__title save-title welcome-add">
	      На каждое устройство нужна отдельная конфигурация!
	    </div>
	    <div class="popup__button welcome">
		    <button class="button button--welcome" @click="triggerStepThree">Далее</button>
	    </div>
	  </div>
	  <div class="popup__fake-area" ref="endLine" />
	  <div class="popup__text welcome bottom-close">
		  <a @click="close">Пропустить</a>
	  </div>
	</div>
</template>

<script setup>

import {ref, watchEffect} from "vue";
import generateLines from "@/assets/helpers/animations";

const props = defineProps({
  buttonPosition: {
    type: Object
  }
});
const startLine = ref(null);
const endLine = ref(null);
const { applySizePositionOptions, firstLine, secondLine, thirdLine } = generateLines(startLine, endLine,
		{endSocket: 'bottom'},
		{endSocket: 'bottom'},
		{endSocket: 'bottom'});

watchEffect(() => {
	applySizePositionOptions(endLine, props.buttonPosition)
})

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
	firstLine.value.remove();
	secondLine.value.remove();
	thirdLine.value.remove();
	emit('darkenElements');
};

const triggerStepThree = () => {
	emit('triggerStepThree');
	firstLine.value.remove();
	secondLine.value.remove();
	thirdLine.value.remove();
	emit('darkenElements');
};
</script>
