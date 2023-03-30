<template lang="pug">
include ../assets/pug/base
+b.popup
  +e.overlay.welcome
  +e.alert.welcome-add(ref='startLine')
    +e.title.welcome-add
      | Нажмите тут для добавления пользователя
    +e.button.welcome
      +button('Далее', 'button', 'welcome')(@click="triggerStepThree")
  +e.fake-area(ref='endLine')
  +e.text.welcome.bottom-close
    a(@click="close")
      | Пропустить
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
