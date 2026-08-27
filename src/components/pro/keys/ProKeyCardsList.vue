<template>
  <div class="pro-keys__grid">
    <ProKeyCard
      v-for="key in keys"
      :key="key.id"
      :key-item="key"
      :menu-open="openMenuId === key.id"
      @close-menu="closeMenu"
      @copy="(k) => emit('copy', k)"
      @open-confirm="(k, kind) => emit('open-confirm', k, kind)"
      @open-extend="(k) => emit('open-extend', k)"
      @open-name="(k) => emit('open-name', k)"
      @open-note="(k) => emit('open-note', k)"
      @open-pay="emit('open-pay')"
      @open-sold="(k) => emit('open-sold', k)"
      @open-upgrade="(k) => emit('open-upgrade', k)"
      @restore="(k) => emit('restore', k)"
      @toggle-menu="(id) => emit('toggle-menu', id)"
    />
  </div>
</template>

<script setup>
import ProKeyCard from '@/components/pro/keys/ProKeyCard.vue';

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

const closeMenu = (key) => {
  if (props.openMenuId === key.id) {
    emit('toggle-menu', key.id);
  }
};
</script>
