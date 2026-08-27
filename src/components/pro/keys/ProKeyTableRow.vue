<template>
  <div
    :class="{'pro-key-table__row--muted': isDead || isBlocked}"
    :title="t('pro.table.expandHint')"
    class="pro-key-table__row"
    @click="emit('toggle-expand', keyItem.id)"
  >
    <div class="pro-key-table__cell pro-key-table__cell--user">
      <span class="pro-key-table__expand-icon">{{ expanded ? '▾' : '▸' }}</span>{{ keyItem.user }}
    </div>
    <div class="pro-key-table__cell pro-key-table__cell--name">
      <div :class="{'pro-key-table__name--unnamed': !hasName, 'pro-key-table__name--dead': isDead}" class="pro-key-table__name">
        {{ displayName }}
      </div>
      <button v-if="hasNote" :title="t('pro.card.hasNote')" class="pro-key-table__note-icon" type="button" @click.stop="emit('open-note', keyItem)">
        <SvgIcon name="pro-note"/>
      </button>
    </div>
    <div class="pro-key-table__cell">
      <span :class="{'pro-key-table__tariff--free': isFree, 'pro-key-table__tariff--muted': isDead || isBlocked}" class="pro-key-table__tariff">
        {{ tariffLabel }}
      </span>
    </div>
    <div :class="`pro-key-table__cell--status-${status}`" class="pro-key-table__cell pro-key-table__cell--status">
      <span class="pro-key-table__status-dot"></span>{{ statusWord }}
    </div>
    <div :class="{'pro-key-table__cell--warn': isWarn, 'pro-key-table__cell--dead': isDead}" class="pro-key-table__cell pro-key-table__cell--mono">
      {{ untilText }}
    </div>
    <div class="pro-key-table__cell pro-key-table__cell--mono pro-key-table__cell--faded">{{ lastLabel }}</div>
    <div class="pro-key-table__cell pro-key-table__cell--mono pro-key-table__cell--right">{{ gbText }}</div>
    <div class="pro-key-table__cell pro-key-table__cell--right">
      <button
        v-if="!isFree"
        :class="{'pro-key-table__sold--muted': !keyItem.sold}"
        class="pro-key-table__sold"
        type="button"
        @click.stop="emit('open-sold', keyItem)"
      >
        {{ soldText }}
      </button>
      <span v-else class="pro-key-table__sold pro-key-table__sold--muted pro-key-table__sold--static">{{ soldText }}</span>
    </div>
    <div :class="`pro-key-table__cell--profit-${profitTone}`" class="pro-key-table__cell pro-key-table__cell--mono pro-key-table__cell--right pro-key-table__cell--strong">
      {{ profitText }}
    </div>
    <div class="pro-key-table__cell pro-key-table__cell--actions">
      <button
        :class="{'pro-key-table__copy--blocked': isBlocked}"
        :title="isBlocked ? t('pro.toasts.copyBlocked') : t('pro.menu.copy')"
        class="pro-key-table__copy"
        type="button"
        @click.stop="emit('copy', keyItem)"
      >
        ⧉
      </button>
      <button class="pro-key-table__gear" type="button" @click.stop="emit('toggle-menu', keyItem.id)">⚙</button>
    </div>

    <div v-if="expanded" class="pro-key-table__expanded" @click.stop>
      <ProKeyProtoSwitcher :key-item="keyItem" class="pro-key-table__proto">
        <button v-if="!isDead && !isBlocked" class="pro-key-table__proto-copy" type="button" @click="emit('copy', keyItem)">
          {{ t('pro.table.copy') }}
        </button>
      </ProKeyProtoSwitcher>
    </div>

    <ProKeyMenu
      v-if="menuOpen"
      :has-name="hasName"
      :has-note="hasNote"
      :has-sold="Boolean(keyItem.sold)"
      :is-free="isFree"
      variant="table"
      @close="emit('close-menu', keyItem)"
      @deactivate="emit('open-confirm', keyItem, 'off')"
      @delete="emit('open-confirm', keyItem, 'del')"
      @extend="emit('open-extend', keyItem)"
      @note="emit('open-note', keyItem)"
      @rename="emit('open-name', keyItem)"
      @sold="emit('open-sold', keyItem)"
      @upgrade="emit('open-upgrade', keyItem)"
    />
  </div>
</template>

<script setup>
import {toRef} from 'vue';
import {useI18n} from 'vue-i18n';
import SvgIcon from '@/components/SvgIcon.vue';
import ProKeyProtoSwitcher from '@/components/pro/keys/ProKeyProtoSwitcher.vue';
import ProKeyMenu from '@/components/pro/keys/ProKeyMenu.vue';
import {useProKeyView} from '@/composables/useProKeyView';

const props = defineProps({
  keyItem: {
    type: Object,
    required: true,
  },
  menuOpen: {type: Boolean},
  expanded: {type: Boolean},
});

const emit = defineEmits([
  'copy', 'toggle-menu', 'close-menu', 'toggle-expand',
  'open-sold', 'open-name', 'open-note', 'open-extend',
  'open-upgrade', 'open-confirm',
]);

const {t} = useI18n();
const {
  status, isFree, isDead, isBlocked, isWarn,
  hasName, hasNote, displayName, statusWord, tariffLabel,
  untilText, lastLabel, gbText,
  profitText, profitTone, soldText,
} = useProKeyView(toRef(props, 'keyItem'));
</script>
