<template>
  <svg :class="className" xmlns="http://www.w3.org/2000/svg">
    <use :xlink:href="iconHref" xmlns:xlink="http://www.w3.org/1999/xlink"/>
  </svg>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const iconHref = computed(() => `#${props.name}`);
const className = computed(() => `svg-icon svg-icon--${props.name}`);
</script>
