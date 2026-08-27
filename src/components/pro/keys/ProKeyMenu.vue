<template>
  <div ref="menuRef" :class="{'pro-key-menu--table': variant === 'table'}" class="pro-key-menu" @click.stop>
    <template v-if="variant === 'card'">
      <div class="pro-key-menu__section">{{ t('pro.menu.sectionKey') }}</div>
      <button class="pro-key-menu__item" type="button" @click="emit('copy')">
        {{ t('pro.menu.copy') }}
      </button>
    </template>
    <button class="pro-key-menu__item" type="button" @click="emit('rename')">
      {{ hasName ? t('pro.menu.rename') : t('pro.menu.addName') }}
    </button>
    <button class="pro-key-menu__item" type="button" @click="emit('note')">
      {{ hasNote ? t('pro.menu.comment') : t('pro.menu.addComment') }}
      <span v-if="hasNote" class="pro-key-menu__dot"></span>
    </button>
    <button class="pro-key-menu__item" type="button" @click="emit('sold')">
      {{ hasSold ? t('pro.menu.sold') : t('pro.menu.setSold') }}
    </button>
    <div v-if="variant === 'card'" class="pro-key-menu__section pro-key-menu__section--bordered">{{ t('pro.menu.sectionTerm') }}</div>
    <button v-if="!isFree" class="pro-key-menu__item" type="button" @click="emit('extend')">
      {{ t('pro.menu.extend') }}
    </button>
    <button class="pro-key-menu__item" type="button" @click="emit('upgrade')">
      {{ isFree ? t('pro.menu.upgradeToPro') : t('pro.menu.changeTariff') }}
    </button>
    <div v-if="variant === 'card'" class="pro-key-menu__section pro-key-menu__section--bordered">{{ t('pro.menu.sectionDanger') }}</div>
    <button class="pro-key-menu__item pro-key-menu__item--danger" type="button" @click="emit('deactivate')">
      {{ t('pro.menu.deactivate') }}
    </button>
    <button class="pro-key-menu__item pro-key-menu__item--danger" type="button" @click="emit('delete')">
      {{ t('pro.menu.delete') }}
    </button>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import useClickOutside from '@/assets/hooks/useClickOutside';

defineProps({
  variant: {
    type: String,
    default: 'card',
  },
  hasName: {type: Boolean},
  hasNote: {type: Boolean},
  hasSold: {type: Boolean},
  isFree: {type: Boolean},
});

const emit = defineEmits(['copy', 'rename', 'note', 'sold', 'extend', 'upgrade', 'deactivate', 'delete', 'close']);

const {t} = useI18n();

const menuRef = ref(null);
useClickOutside(menuRef, () => emit('close'));
</script>
