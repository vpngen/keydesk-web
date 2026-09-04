<template>
  <div class="pro-key-table">
    <div class="pro-key-table__inner">
      <div class="pro-key-table__head">
        <div class="pro-key-table__head-cell pro-key-table__head-cell--first">{{ t('pro.table.colKey') }}</div>
        <button class="pro-key-table__head-cell pro-key-table__head-cell--sortable" type="button" @click="setSort('name')">
          {{ t('pro.table.colName') }} {{ arrow('name') }}
        </button>
        <div class="pro-key-table__head-cell">{{ t('pro.table.colTariff') }}</div>
        <div class="pro-key-table__head-cell">{{ t('pro.table.colStatus') }}</div>
        <button class="pro-key-table__head-cell pro-key-table__head-cell--sortable" type="button" @click="setSort('until')">
          {{ t('pro.table.colUntil') }} {{ arrow('until') }}
        </button>
        <button class="pro-key-table__head-cell pro-key-table__head-cell--sortable" type="button" @click="setSort('last')">
          {{ t('pro.table.colLast') }} {{ arrow('last') }}
        </button>
        <button class="pro-key-table__head-cell pro-key-table__head-cell--sortable pro-key-table__head-cell--right" type="button" @click="setSort('traffic')">
          {{ t('pro.table.colTraffic') }} {{ arrow('traffic') }}
        </button>
        <div class="pro-key-table__head-cell pro-key-table__head-cell--right">{{ t('pro.table.colSold') }}</div>
        <button class="pro-key-table__head-cell pro-key-table__head-cell--sortable pro-key-table__head-cell--right" type="button" @click="setSort('profit')">
          {{ t('pro.table.colProfit') }} {{ arrow('profit') }}
        </button>
        <div class="pro-key-table__head-cell pro-key-table__head-cell--center">{{ t('pro.table.colActions') }}</div>
      </div>
      <ProKeyTableRow
        v-for="key in keys"
        :key="key.id"
        :expanded="expandedId === key.id"
        :key-item="key"
        :menu-open="openMenuId === key.id"
        @close-menu="closeMenu"
        @copy="(k) => emit('copy', k)"
        @open-confirm="(k, kind) => emit('open-confirm', k, kind)"
        @open-extend="(k) => emit('open-extend', k)"
        @open-name="(k) => emit('open-name', k)"
        @open-note="(k) => emit('open-note', k)"
        @open-sold="(k) => emit('open-sold', k)"
        @open-upgrade="(k) => emit('open-upgrade', k)"
        @toggle-expand="toggleExpand"
        @toggle-menu="(id) => emit('toggle-menu', id)"
      />
      <div class="pro-key-table__footer">
        <div>{{ countsLine }}</div>
        <div>{{ t('pro.table.pageOf', {page: 1, total: 1}) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import ProKeyTableRow from '@/components/pro/keys/ProKeyTableRow.vue';
import {useProKeysStore} from '@/store/proKeys';
import {useProKeysFilterStore} from '@/store/proKeysFilter';

const props = defineProps({
  keys: {
    type: Array,
    required: true,
  },
  openMenuId: {
    type: [String, null],
    default: null,
  },
});

const emit = defineEmits([
  'copy', 'restore', 'toggle-menu',
  'open-sold', 'open-name', 'open-note', 'open-extend',
  'open-upgrade', 'open-confirm', 'open-pay',
]);

const {t} = useI18n();
const proKeysStore = useProKeysStore();
const filterStore = useProKeysFilterStore();
const {keysList, freeCount} = storeToRefs(proKeysStore);
const {selectedSort} = storeToRefs(filterStore);

const expandedId = ref(null);

const countsLine = computed(() => t('pro.table.countsLine', {
  shown: props.keys.length,
  total: keysList.value.length,
  free: freeCount.value,
  pro: keysList.value.length - freeCount.value,
}));

const arrow = (sort) => (selectedSort.value === sort ? '↓' : '↕');

const setSort = (sort) => {
  selectedSort.value = sort;
};

const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const closeMenu = (key) => {
  if (props.openMenuId === key.id) {
    emit('toggle-menu', key.id);
  }
};
</script>
