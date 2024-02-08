<template>
       	<div class="profile__accordion-question"
						 :class="{'profile__accordion-question--open':isExpanded}"
						 @click="emit('setExpandedQuestionIndex')"
						 v-html="title">
				</div>
        <div class="profile__accordion-responsion"
						 :class="{'profile__accordion-responsion--open':isExpanded}" >
            <p v-for="(answer) in extraContent" v-html="answer"></p>
        </div>
</template>

<script setup>
const emit = defineEmits(['setExpandedQuestionIndex']);

const props = defineProps({
    title: { type: String, required: true },
    extraContent: { type: Array, required: true },
    isExpanded: { type: Boolean }
});
</script>

