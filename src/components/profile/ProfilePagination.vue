<template>
  <nav v-if="totalPages > 1" class="profile__pagination" aria-label="Pagination">
    <button
      :aria-label="t('cabinet.pagination.prev')"
      :disabled="currentPage === 1"
      class="profile__pagination-button"
      type="button"
      @click="goTo(currentPage - 1)"
    >
      ‹
    </button>
    <template v-for="(p, i) in pages" :key="`p-${i}-${p}`">
      <span v-if="p === '...'" class="profile__pagination-ellipsis">…</span>
      <button
        v-else
        :aria-current="p === currentPage ? 'page' : undefined"
        :class="{ 'is-active': p === currentPage }"
        class="profile__pagination-button"
        type="button"
        @click="goTo(p)"
      >
        {{ p }}
      </button>
    </template>
    <button
      :aria-label="t('cabinet.pagination.next')"
      :disabled="currentPage === totalPages"
      class="profile__pagination-button"
      type="button"
      @click="goTo(currentPage + 1)"
    >
      ›
    </button>
  </nav>
</template>

<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:page']);

const {t} = useI18n();

const pages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  if (total <= 7) {
    return Array.from({length: total}, (_, i) => i + 1);
  }
  const set = new Set([1, total, current, current - 1, current + 1]);
  if (current <= 3) {
    set.add(2).add(3).add(4);
  }
  if (current >= total - 2) {
    set.add(total - 1).add(total - 2).add(total - 3);
  }
  const sorted = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('...');
    }
    result.push(sorted[i]);
  }
  return result;
});

const goTo = (page) => {
  if (typeof page !== 'number') return;
  if (page < 1 || page > props.totalPages) return;
  if (page === props.currentPage) return;
  emit('update:page', page);
};
</script>
