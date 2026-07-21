<template>
  <div ref="headlineRef" class="profile__headline">
    <h2 class="profile__title">
      <span v-if="isLoading && !brigadierName" class="profile__title-skeleton" aria-hidden="true"/>
      <template v-else>{{ t('cabinet.profile.hello') }}{{ displayedName }}</template>
    </h2>
    <div class="profile__search">
      <div class="profile__filter-block">
        <FiltersPanel
          v-if="statusList"
          :selectedFilterSort="selectedSort"
          :selectedFilterStatus="selectedStatus"
          :statusList="statusList"
          @update:selectedFilterSort="selectedSort = $event"
          @update:selectedFilterStatus="selectedStatus = $event"
        />
      </div>
      <div class="profile__search-block">
        <div :class="highlightedElementProperties.searchButton?.highlight" class="profile__add-label">
          <input
            ref="searchButton"
            v-model="filterText"
            :disabled="highlightedElementProperties.searchButton?.disabled"
            class="profile__search-input"
            :placeholder="t('cabinet.profile.searchPlaceholder')"
            type="text"
          />
          <button
            :disabled="highlightedElementProperties.searchButton?.disabled"
            class="button button--search-button"
            type="button"
          >
            {{ t('cabinet.profile.search') }}
          </button>
        </div>
        <div class="profile__add-button">
          <button
            id="welcome-add-end"
            ref="buttonAddUser"
            :class="highlightedElementProperties.buttonAddUser?.highlight"
            :disabled="highlightedElementProperties.buttonAddUser?.disabled"
            class="button"
            type="button"
            @click="$emit('addUser')"
          >
            {{ t('cabinet.profile.add') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import FiltersPanel from '@/components/FiltersPanel.vue';
import {useDisplayPersonName} from '@/composables/useDisplayPersonName';
import {useUsersFilterStore} from '@/store/usersFilter';

const props = defineProps({
  brigadierName: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  statusList: {
    type: [Set, Array],
    default: null,
  },
  highlightedElementProperties: {
    type: Object,
    default: () => ({}),
  },
});

defineEmits(['addUser']);

const {t} = useI18n();
const {displayName} = useDisplayPersonName();
const filterStore = useUsersFilterStore();
const {filterText, selectedSort, selectedStatus} = storeToRefs(filterStore);

const headlineRef = ref(null);
const searchButton = ref(null);
const buttonAddUser = ref(null);

const displayedName = computed(() =>
  props.brigadierName ? displayName(props.brigadierName) : t('cabinet.profile.brigadierFallback')
);

defineExpose({
  headlineRef,
  searchButton,
  buttonAddUser,
});
</script>
