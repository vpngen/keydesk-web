<template>
	<WelcomePageStepOne
		v-if="step===1"
		@close="closeComponent"
		@triggerNextStep ="triggerNextSteps()"
		@highlight="highlightElement()"
	/>
	<WelcomePageStepTwo
		v-if="step===2"
		:buttonPosition="firstUserProfileCardPosition"
		@close="closeComponent()"
		@triggerStepFive ="triggerNextSteps()"
		@highlight="highlightElement()"
		@darkenElements="darkenElement()"
	/>
	<WelcomePageStepThree
		v-if="step===3"
		:buttonPosition="buttonPositionForWelcomePageStepTwo"
		@highlight="highlightElement()"
		@darkenElements="darkenElement()"
		@triggerStepThree ="triggerNextSteps()"
		@close="closeComponent()"
	/>
	<WelcomePageStepFour
		v-if="step===4"
		@close="closeComponent()"
		@highlight="highlightElement()"
		@triggerStepFour ="triggerNextSteps()"
	/>
	<WelcomePageStepFive
		v-if="step===5"
		:buttonPosition="secondUserProfileCardPosition"
		@close="closeComponent()"
		@triggerStepSix ="triggerNextSteps()"
		@highlight="highlightElement()"
		@darkenElements="darkenElement()"
	/>
	<WelcomePageStepSix
		v-if="step===6"
		:buttonPosition="searchButtonPosition"
		@close="closeComponent()"
		@triggerStepSeven ="triggerNextSteps()"
		@highlight="highlightElement()"
		@darkenElements="darkenElement()"
	/>
	<WelcomePageStepSeven
		v-if="step===7"
		@close="closeComponent()"
	/>
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

const step = ref(1);
const buttonPositionForWelcomePageStepTwo = ref(null);
const firstUserProfileCardPosition = ref(null);
const secondUserProfileCardPosition = ref(null);
const searchButtonPosition = ref(null);
const props = defineProps({
	elementStepThree: {
		type: Object
	},
	elementStepTwo: {
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

function getElementData(el, position) {
	position.value = el.getBoundingClientRect();
}

onMounted(() => {
	document.body.style.overflow = 'hidden';
	emit('toggleDisable');
})

const initElementsContainerData = (elementName, position) => {
	getElementData(elementName, position);
	window.addEventListener('resize', () => getElementData(elementName, position));
	window.addEventListener('scroll', () => getElementData(elementName, position));
}
const removeElementsContainerData = (elementName, position) => {
	window.removeEventListener('resize', () => getElementData(elementName, position));
	window.removeEventListener('scroll', () => getElementData(elementName, position));
}

const highlightElement = () => {
	switch (step.value) {
		case 2: {
			emit('highlightElement', 'firstUserProfileCard');
			break;
		}
		case 3: {
			emit('highlightElement', 'buttonAddUser');
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
			emit('darkenElement', 'firstUserProfileCard');
			break;
		}
		case 4: {
			emit('darkenElement', 'buttonAddUser');
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
			initElementsContainerData(props.elementStepTwo[0], firstUserProfileCardPosition);
			break;
		}
		case 3: {
			removeElementsContainerData(props.elementStepTwo[0], firstUserProfileCardPosition);
			initElementsContainerData(props.elementStepThree, buttonPositionForWelcomePageStepTwo);
			break;
		}
		case 4: {
			removeElementsContainerData(props.elementStepThree, buttonPositionForWelcomePageStepTwo);
			break;
		}
		case 5: {
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
	emit('toggleDisable');
	localStorage.setItem('isInstructionHidden', 'true');
	emit('getUsers');
	document.body.style.overflow = 'auto';
}
</script>
