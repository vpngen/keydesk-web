<template>
  <div class="pro-empty">
    <div class="pro-empty__icon">{{ variant.icon }}</div>
    <div class="pro-empty__title">{{ t(`pro.empty.${variant.kind}.title`) }}</div>
    <div class="pro-empty__text">{{ t(`pro.empty.${variant.kind}.text`, variant.params) }}</div>
    <button class="pro-empty__cta" type="button" @click="variant.action()">
      {{ t(`pro.empty.${variant.kind}.cta`) }}
    </button>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useProKeysFilterStore} from '@/store/proKeysFilter';

const props = defineProps({
  hasKeys: {type: Boolean},
  hasSearch: {type: Boolean},
  paidFilter: {type: Boolean},
});

const emit = defineEmits(['create', 'clear-search', 'clear-filters']);

const {t} = useI18n();
const filterStore = useProKeysFilterStore();
const {filterText} = storeToRefs(filterStore);

const variant = computed(() => {
  if (!props.hasKeys) {
    return {kind: 'noKeys', icon: t('pro.empty.noKeys.icon'), params: {}, action: () => emit('create')};
  }
  if (props.hasSearch) {
    return {kind: 'search', icon: '⌕', params: {query: filterText.value.trim()}, action: () => emit('clear-search')};
  }
  if (props.paidFilter) {
    return {kind: 'noPaid', icon: '▤', params: {}, action: () => emit('clear-filters')};
  }
  return {kind: 'filters', icon: '▤', params: {}, action: () => emit('clear-filters')};
});
</script>
