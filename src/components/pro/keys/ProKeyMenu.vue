<template>
  <!-- С якорем (таблица) меню уезжает в #app и позиционируется от кнопки:
       так его не режет прокручиваемый контейнер таблицы. -->
  <teleport :disabled="!anchor" to="#app">
    <div
      ref="menuRef"
      :class="{'pro-key-menu--table': variant === 'table', 'pro-key-menu--floating': Boolean(anchor)}"
      :style="floatingStyle"
      class="pro-key-menu"
      role="menu"
      @click.stop
    >
      <template v-if="variant === 'card'">
        <div class="pro-key-menu__section">{{ t('pro.menu.sectionKey') }}</div>
        <button class="pro-key-menu__item" role="menuitem" type="button" @click="emit('copy')">
          {{ t('pro.menu.copy') }}
        </button>
      </template>
      <button class="pro-key-menu__item" role="menuitem" type="button" @click="emit('rename')">
        {{ hasName ? t('pro.menu.rename') : t('pro.menu.addName') }}
      </button>
      <button class="pro-key-menu__item" role="menuitem" type="button" @click="emit('note')">
        {{ hasNote ? t('pro.menu.comment') : t('pro.menu.addComment') }}
        <span v-if="hasNote" class="pro-key-menu__dot"></span>
      </button>
      <button class="pro-key-menu__item" role="menuitem" type="button" @click="emit('sold')">
        {{ hasSold ? t('pro.menu.sold') : t('pro.menu.setSold') }}
      </button>
      <div v-if="variant === 'card'" class="pro-key-menu__section pro-key-menu__section--bordered">{{ t('pro.menu.sectionTerm') }}</div>
      <button v-if="canUpgrade" class="pro-key-menu__item" role="menuitem" type="button" @click="emit('upgrade')">
        {{ isFree ? t('pro.menu.upgradeToPro') : t('pro.menu.changeTariff') }}
      </button>
      <div v-if="variant === 'card'" class="pro-key-menu__section pro-key-menu__section--bordered">{{ t('pro.menu.sectionDanger') }}</div>
      <button class="pro-key-menu__item pro-key-menu__item--danger" role="menuitem" type="button" @click="emit('deactivate')">
        {{ t('pro.menu.deactivate') }}
      </button>
      <button class="pro-key-menu__item pro-key-menu__item--danger" role="menuitem" type="button" @click="emit('delete')">
        {{ t('pro.menu.delete') }}
      </button>
    </div>
  </teleport>
</template>

<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import useClickOutside from '@/assets/hooks/useClickOutside';

const props = defineProps({
  variant: {
    type: String,
    default: 'card',
  },
  hasName: {type: Boolean},
  hasNote: {type: Boolean},
  hasSold: {type: Boolean},
  isFree: {type: Boolean},
  // Выше Pro Unlim тарифа нет - пункт «сменить тариф» ему не показываем.
  canUpgrade: {
    type: Boolean,
    default: true,
  },
  // Кнопка-якорь (HTMLElement): меню рисуется фиксированно рядом с ней и
  // раскрывается вверх, если снизу не хватает места.
  anchor: {
    type: null,
    default: null,
  },
});

// close получает причину: 'escape' - вернуть фокус на кнопку.
const emit = defineEmits(['copy', 'rename', 'note', 'sold', 'upgrade', 'deactivate', 'delete', 'close']);

const {t} = useI18n();

const EDGE = 8;
const GAP = 4;

const menuRef = ref(null);
const pos = ref({top: 0, left: 0});

const floatingStyle = computed(() => (props.anchor ? {top: `${pos.value.top}px`, left: `${pos.value.left}px`} : undefined));

const place = () => {
  if (!props.anchor || !menuRef.value) return;
  const a = props.anchor.getBoundingClientRect();
  const m = menuRef.value.getBoundingClientRect();
  const width = m.width || 224;
  const left = Math.max(EDGE, Math.min(a.right - width, window.innerWidth - width - EDGE));
  let top = a.bottom + GAP;
  if (top + m.height > window.innerHeight - EDGE) {
    top = Math.max(EDGE, a.top - m.height - GAP);
  }
  pos.value = {top, left};
};

const onKeydown = (e) => {
  if (e.key === 'Escape') {
    e.stopPropagation();
    emit('close', 'escape');
  }
};

useClickOutside(menuRef, () => emit('close', 'outside'));

onMounted(async () => {
  document.addEventListener('keydown', onKeydown);
  if (props.anchor) {
    window.addEventListener('scroll', place, {passive: true, capture: true});
    window.addEventListener('resize', place, {passive: true});
    await nextTick();
    place();
  }
  // Первый пункт получает фокус: меню доступно с клавиатуры (Tab/Enter, Esc).
  menuRef.value?.querySelector('.pro-key-menu__item')?.focus({preventScroll: true});
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
  window.removeEventListener('scroll', place, {capture: true});
  window.removeEventListener('resize', place);
});
</script>
