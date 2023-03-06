<template lang="pug">
include ../assets/pug/base
WelcomePageStepOne(
	v-if="step===1"
	@close="closeComponent"
	@triggerNextStep ="triggerNextSteps()"
	@highlight="highlightElement()")
WelcomePageStepTwo(
	v-if="step===2"
	:buttonPosition="buttonPositionForWelcomePageStepTwo"
	@highlight="highlightElement()"
	@darkenElements="darkenElement()"
	@triggerStepThree ="triggerNextSteps()"
	@close="closeComponent()")
WelcomePageStepThree(
	v-if="step===3"
	@close="closeComponent()"
	@highlight="highlightElement()"
	@triggerStepFour ="triggerNextSteps()")
WelcomePageStepFour(
	v-if="step===4"
	:buttonPosition="firstUserProfileCardPosition"
	@close="closeComponent()"
	@triggerStepFive ="triggerNextSteps()"
	@highlight="highlightElement()"
	@darkenElements="darkenElement()")
WelcomePageStepFive(
	v-if="step===5"
	:buttonPosition="secondUserProfileCardPosition"
	@close="closeComponent()"
	@triggerStepSix ="triggerNextSteps()"
	@highlight="highlightElement()"
	@darkenElements="darkenElement()")
WelcomePageStepSix(
	v-if="step===6"
	:buttonPosition="searchButtonPosition"
	@close="closeComponent()"
	@triggerStepSeven ="triggerNextSteps()"
	@highlight="highlightElement()"
	@darkenElements="darkenElement()")
WelcomePageStepSeven(
	v-if="step===7"
	@close="closeComponent()")
</template>

<script setup>
import {onMounted, ref} from "vue";
import WelcomePageStepOne from "@/components/WelcomePageStepOne.vue";
import WelcomePageStepTwo from "@/components/WelcomePageStepTwo.vue";
import WelcomePageStepThree from "@/components/WelcomePageStepThree.vue";
import WelcomePageStepFour from "@/components/WelcomePageStepFour.vue";
import WelcomePageStepFive from "@/components/WelcomePageStepFive.vue";
import WelcomePageStepSix from "@/components/WelcomePageStepSix.vue";
import WelcomePageStepSeven from "@/components/WelcomePageStepSeven.vue";
import scrollLock from 'scroll-lock';

const step = ref(1);
const buttonPositionForWelcomePageStepTwo = ref(null);
const firstUserProfileCardPosition = ref(null);
const secondUserProfileCardPosition = ref(null);
const searchButtonPosition = ref(null);
const props = defineProps({
	elementStepTwo: {
		type: Object
	},
	elementStepFour: {
		type: Object
	},
	elementStepFive: {
		type: Object
	},
	elementStepSix: {
		type: Object
	},
});

const emit = defineEmits(['getUsers', 'toggleDisable', 'highlightElement', 'darkenElement', 'updateValue']);

const getUsers = () => {
	emit('getUsers');
};

const toggleDisableAll = () => {
	emit('toggleDisable');
};
const updateValue = () => {
	emit('updateValue');
};

function getElementData(el, position) {
	position.value = el.getBoundingClientRect();
}

onMounted(() => {
	scrollLock.disablePageScroll();
	toggleDisableAll();
})

function debounce(f, ms = 10) {
	let isCooldown = false;
	return function () {
		if (isCooldown) return;
		f.apply(this, arguments);
		isCooldown = true;
		setTimeout(() => isCooldown = false, ms);
	};
}

const initElementsContainerData = (elementName, position) => {
	getElementData(elementName, position);
	window.addEventListener('resize', debounce(() => getElementData(elementName, position)));
}
const removeElementsContainerData = (elementName, position) => {
	window.removeEventListener('resize', debounce(() => getElementData(elementName, position)));
}


const highlightElement = () => {
	switch (step.value) {
		case 2: {
			emit('highlightElement', 'buttonAddUser');
			break;
		}
		case 4: {
			emit('highlightElement', 'firstUserProfileCard');
			break;
		}
		case 5: {
			emit('highlightElement', 'secondUserProfileCard');
			break;
		}
		case 6: {
			emit('highlightElement', 'searchButton');
			break;
		}
	}
};

const darkenElement = () => {
	switch (step.value) {
		case 3: {
			emit('darkenElement', 'buttonAddUser');
			break;
		}
		case 5: {
			emit('darkenElement', 'firstUserProfileCard');
			break;
		}
		case 6: {
			emit('darkenElement', 'secondUserProfileCard');
			break;
		}
		case 7: {
			emit('darkenElement', 'searchButton');
			break;
		}
	}
};

const triggerNextSteps = () => {
	step.value += 1;
	switch (step.value) {
		case 2: {
			initElementsContainerData(props.elementStepTwo, buttonPositionForWelcomePageStepTwo);
			break;
		}
		case 3: {
			removeElementsContainerData(props.elementStepTwo, buttonPositionForWelcomePageStepTwo);
			break;
		}
		case 4: {
			updateValue();
			initElementsContainerData(props.elementStepFour[0], firstUserProfileCardPosition);
			break;
		}
		case 5: {
			removeElementsContainerData(props.elementStepFour[0], firstUserProfileCardPosition);
			initElementsContainerData(props.elementStepFive[0], secondUserProfileCardPosition);
			break;
		}
		case 6: {
			removeElementsContainerData(props.elementStepFive[0], secondUserProfileCardPosition);
			initElementsContainerData(props.elementStepSix, searchButtonPosition);
			break;
		}
		case 7: {
			removeElementsContainerData(props.elementStepSix, searchButtonPosition);
			break;
		}
	}
}

const closeComponent = () => {
	step.value = 0;
	toggleDisableAll();
	localStorage.setItem('isInstructionHidden', 'true');
	getUsers();
	scrollLock.enablePageScroll();
}
</script>