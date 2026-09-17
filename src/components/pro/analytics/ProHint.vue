<template>
  <span :aria-label="text" :title="text" class="pro-analytics__hint" role="img">?</span>
</template>

<script setup>
// «?» с подсказкой (title): у заголовков блоков, карточек и строк аналитики.
defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>
