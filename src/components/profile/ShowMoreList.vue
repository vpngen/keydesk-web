<template>
  <div class="profile__show-more-container">
    <div class="profile__show-more-column profile__show-more-column--mobile">
      <ShowMoreItem
        v-for="(card, index) in cardsList"
        :key="card.question"
        :extraContent="card.answers"
        :isExpanded="expandedQuestionIndex===index"
        :title="card.question"
        @setExpandedQuestionIndex=setExpandedQuestionIndex(index);
      />
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import ShowMoreItem from "./ShowMoreItem.vue";
import {useI18n} from 'vue-i18n';

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  isShown: {type: Boolean}
});

const {tm} = useI18n();

const expandedQuestionIndex = ref(null);
const cardColumns = ref([[], []]);

const cardsList = computed(() => tm('cabinet.faq') || []);

watch([cardsList, () => props.isShown], () => {
  distributeCards();
  if (props.isShown) {
    expandedQuestionIndex.value = null;
  }
});

const distributeCards = () => {
  cardColumns.value = [[], []];

  cardsList.value.forEach((card, index) => {
    cardColumns.value[index % 2].push(card);
  });
};

const setExpandedQuestionIndex = (index) => {
  expandedQuestionIndex.value = expandedQuestionIndex.value === index ? null : index;
}

onMounted(() => {
  distributeCards();
  window.addEventListener('resize', distributeCards);
});

onUnmounted(() => {
  window.removeEventListener('resize', distributeCards);
});
</script>
