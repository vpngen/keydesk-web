<template>
  <div class="filter-component">
    <div class="sort-filter">
      <button class="sort-filter__button" type="button" @click.stop="openSortMenu">
        <div class="sort-filter">
          <div class="filter-component__title">
            Сортировка:
          </div>
          <template v-if="!getSortingOptionItem(currentSorting)?.textLabel">
            <SvgIcon :name="currentSorting" class="sort-filter__icon"/>
          </template>
          <template v-else>
            <span class="sort-filter__text-label"> {{ getSortingOptionItem(currentSorting)?.textLabel }} </span>
          </template>
          <div ref="sortOptionRef" :class="{ active: showSortMenu }" class="sort-filter__filter-menu">
            <template v-for="(option, index) in sortingList" :key="index">
              <a class="sort-filter__filter-item" href="#" @click.stop="setSorting(sortingMap[option.label])">
                <span class="sort-filter__filter-name">{{ option.name }}</span>
              </a>
            </template>
          </div>
        </div>
      </button>
    </div>
    <button class="status-filter__button" type="button" @click.stop="openStatusMenu">
      <div class="status-filter">
        <div class="filter-component__title">
          Статус:
        </div>
        <span :class="['status-filter__icon', 'main-icon', currentStatus]"/>
        <div ref="sortStatusRef" :class="{ active: showStatusMenu }" class="status-filter__filter-menu">
          <a class="status-filter__filter-item" href="#" @click.stop="setStatus('all')">
            <span :class="['status-filter__icon', 'all']"/>
            <span class="status-filter__filter-name">Все статусы</span>
          </a>
          <template v-for="(status, index) in props.statusList" :key="index">
            <a class="status-filter__filter-item" href="#" @click.stop="setStatus(statusMap[status])">
              <span :class="['status-filter__icon', statusMap[status]]"/>
              <span class="status-filter__filter-name">{{ profileCardStatus.statusName[status] }}</span>
            </a>
          </template>
        </div>
      </div>
    </button>
  </div>
</template>

<script setup>
import {profileCardStatus, sortingList, sortingMap, statusMap} from '@/assets/constants/profileConstants.js'
import {ref} from 'vue';
import useClickOutside from '@/assets/hooks/useClickOutside.js';
import SvgIcon from "@/components/SvgIcon.vue";

const sortOptionRef = ref(null)
const sortStatusRef = ref(null)

useClickOutside(sortOptionRef, () => {
  showSortMenu.value = false;
});
useClickOutside(sortStatusRef, () => {
  showStatusMenu.value = false;
});

const props = defineProps({
  selectedFilterSort: String,
  selectedFilterStatus: String,
  statusList: null,
});

const emit = defineEmits(['update:selectedFilterSort', 'update:selectedFilterStatus']);

const currentStatus = ref(
  statusMap.all
);

const currentSorting = ref(
  sortingMap.dateAsc
);

const showStatusMenu = ref(false);
const showSortMenu = ref(false);

const openStatusMenu = () => {
  showStatusMenu.value = !showStatusMenu.value;
  showSortMenu.value = false;
};

const openSortMenu = () => {
  showSortMenu.value = !showSortMenu.value;
  showStatusMenu.value = false;
};

const updateFilterStatus = (value) => {
  emit('update:selectedFilterStatus', value);
};

const updateFilterSort = (value) => {
  emit('update:selectedFilterSort', value);
};

const setStatus = (status) => {
  updateFilterStatus(status)
  currentStatus.value = status;
  showStatusMenu.value = false;
};

const setSorting = (sortingOption) => {
  updateFilterSort(sortingOption)
  currentSorting.value = sortingOption;
  showSortMenu.value = false;
};

const getSortingOptionItem = (label) => {
  return sortingList.find(option => option.label === label)
}

</script>
