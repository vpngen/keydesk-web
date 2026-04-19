<template>
  <div class="profile__show-more-container">
    <div class="profile__show-more-column profile__show-more-column--mobile">
      <ShowMoreItem
        v-for="(card, index) in cardsList"
        :key="index"
        :extraContent="card.answers"
        :isExpanded="expandedQuestionIndex===index"
        :title="card.question"
        @setExpandedQuestionIndex=setExpandedQuestionIndex(index);
      />
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watchEffect} from 'vue';
import ShowMoreItem from "@/components/ShowMoreItem.vue";
import {useI18n} from 'vue-i18n';

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  isShown: {type: Boolean}
});

const {tm, locale} = useI18n();

const expandedQuestionIndex = ref(null);

const cardsList = computed(() => tm('cabinet.faq') || []);

const cardColumns = ref([[], []]);

const windowWidth = ref(window.innerWidth);

const distributeCards = () => {
  cardColumns.value = [[], []];

  cardsList.value.forEach((card, index) => {
    cardColumns.value[index % 2].push(card);
  });
};

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  distributeCards();
};

onMounted(() => {
  distributeCards();
  window.addEventListener('resize', handleResize);
});

watchEffect(() => {
  locale.value;
  distributeCards();
  if (props.isShown) {
    expandedQuestionIndex.value = null;
  }

});

const setExpandedQuestionIndex = (index) => {
  expandedQuestionIndex.value = expandedQuestionIndex.value === index ? null : index;
}

const isOpen = ref(false);

const toggleContent = () => {
  isOpen.value = !isOpen.value;
}
</script>

