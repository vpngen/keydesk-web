<template>
  <div class="pro-help__faq">
    <div v-for="i in FAQ_COUNT" :key="i" class="pro-help__faq-item">
      <div
        :class="{'pro-help__faq-question--open': openIndex === i}"
        class="pro-help__faq-question"
        @click="openIndex = openIndex === i ? 0 : i"
      >
        <div class="pro-help__faq-q">{{ t(`pro.help.faq.i${i}.q`) }}</div>
        <div class="pro-help__faq-sign">{{ openIndex === i ? '−' : '+' }}</div>
      </div>
      <div v-if="openIndex === i" class="pro-help__faq-answer">{{ t(`pro.help.faq.i${i}.a`) }}</div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';

const FAQ_COUNT = 9;

const {t} = useI18n();

const openIndex = ref(1);
</script>
