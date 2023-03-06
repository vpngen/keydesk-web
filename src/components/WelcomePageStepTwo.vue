<template lang="pug">
include ../assets/pug/base
+b.popup
  +e.overlay.welcome
  +e.alert.welcome-add(ref='startLine')
    +e.title.welcome-add
      | Нажмите тут для добавления пользователя
    +e.button.welcome
      +button('Далее', 'button', 'welcome')(@click="triggerStepThree")
  +e.fake-area(ref='fakeButton')
  +e.text.welcome.bottom-close
    a(@click="close")
      | Пропустить

</template>

<script setup>

import {onMounted, ref, watchEffect} from "vue";
import LeaderLine from "leader-line-new";

const props = defineProps({
  buttonPosition: {
    type: Object
  }
});
const fakeButton = ref(null)
const line = ref(null)
const startLine = ref(null);
const secondLine = ref(null);

const setLine = () => {
  if (!startLine || !fakeButton) return
  if (line.value) {
    line.value.remove();
  }
	if (secondLine.value) {
		secondLine.value.remove();
	}

  line.value = new LeaderLine(
      startLine.value,
      fakeButton.value,
      {dash: true, color: 'white', size: 2, positionByWindowResize: false}).setOptions({endSocket: 'bottom'});
	secondLine.value = new LeaderLine(
			startLine.value,
			fakeButton.value,
			{dash: true, color: 'white', size: 2, positionByWindowResize: false}).setOptions({endSocket: 'bottom'});
}

const applySizePositionOptions = (ref, position) => {
  if (!position || !ref.value) {
    return
  }
  ref.value.style.width = `${position.width}px`;
  ref.value.style.top = `${position.top}px`;
  ref.value.style.left = `${position.left}px`;
  ref.value.style.height = `${position.height}px`;

	setTimeout(() => {  setLine(position)}, 100)
}

watchEffect(() => {
	applySizePositionOptions(fakeButton, props.buttonPosition)
})

const emit = defineEmits(['highlight', 'close']);

const highlight = () => {
  emit('highlight');
};

const darkenElements = () => {
  emit('darkenElements');
};

const close = () => {
  emit('close');
  line.value.remove();
	secondLine.value.remove();
  darkenElements();
};

const triggerStepThree = () => {
	emit('triggerStepThree');
	line.value.remove();
	secondLine.value.remove();
	darkenElements();
};


</script>
