<template>
  <div :class="{'pro-key-card--dead': isDead, 'pro-key-card--blocked': isBlocked}" class="pro-key-card">
    <div class="pro-key-card__head">
      <div class="pro-key-card__head-main">
        <div class="pro-key-card__name-row">
          <div :class="{'pro-key-card__name--unnamed': !hasName, 'pro-key-card__name--dead': isDead}" class="pro-key-card__name">
            {{ displayName }}
          </div>
          <button v-if="hasNote" :title="t('pro.card.hasNote')" class="pro-key-card__note-icon" type="button" @click.stop="emit('open-note', keyItem)">
            <SvgIcon name="pro-note"/>
          </button>
        </div>
        <div :class="`pro-key-card__status--${status}`" class="pro-key-card__status">
          <span class="pro-key-card__status-dot"></span>
          <span>{{ statusWord }}</span><span class="pro-key-card__status-sep">·</span><span>{{ keyItem.user }}</span>
        </div>
      </div>
      <div :class="{'pro-key-card__tariff--free': isFree, 'pro-key-card__tariff--muted': isDead || isBlocked}" class="pro-key-card__tariff">
        {{ tariffLabel }}
      </div>
    </div>

    <div class="pro-key-card__fields">
      <div class="pro-key-card__field">
        <div :class="{'pro-key-card__field-label--warn': isWarn}" class="pro-key-card__field-label">{{ untilLabel }}</div>
        <div :class="{'pro-key-card__field-value--warn': isWarn, 'pro-key-card__field-value--dead': isDead}" class="pro-key-card__field-value">
          {{ untilText }}
        </div>
      </div>
      <div class="pro-key-card__field">
        <div class="pro-key-card__field-label">{{ t('pro.card.lastVisit') }}</div>
        <div class="pro-key-card__field-value">{{ lastLabel }}</div>
      </div>
      <div class="pro-key-card__field">
        <div class="pro-key-card__field-label">{{ t('pro.card.traffic') }}</div>
        <div class="pro-key-card__field-value">{{ gbText }}</div>
      </div>
      <template v-if="!isFree">
        <div class="pro-key-card__field">
          <div class="pro-key-card__field-label">{{ invoiceLabel }}</div>
          <div class="pro-key-card__field-value pro-key-card__field-value--soft">{{ invoiceValue }}</div>
        </div>
        <div class="pro-key-card__field">
          <div class="pro-key-card__field-label">{{ t('pro.card.soldFor') }}</div>
          <button
            :class="{'pro-key-card__field-value--muted': !keyItem.sold}"
            class="pro-key-card__field-value pro-key-card__field-value--clickable"
            type="button"
            @click="emit('open-sold', keyItem)"
          >
            {{ soldText }}
          </button>
        </div>
        <div class="pro-key-card__field">
          <div class="pro-key-card__field-label">{{ t('pro.card.profit') }}</div>
          <div :class="`pro-key-card__field-value--profit-${profitTone}`" class="pro-key-card__field-value pro-key-card__field-value--strong">
            {{ profitText }}
          </div>
        </div>
      </template>
    </div>

    <ProKeyProtoSwitcher :key-item="keyItem" class="pro-key-card__proto"/>

    <div v-if="isBlocked" class="pro-key-card__blocked-note">{{ t('pro.card.blockedNote') }}</div>

    <div class="pro-key-card__footer">
      <button v-if="canCopy" class="pro-key-card__copy" type="button" @click="emit('copy', keyItem)">
        {{ t('pro.card.copy') }}
      </button>
      <div v-if="isBlocked" class="pro-key-card__copy-blocked">
        <span class="pro-key-card__copy-blocked-x">✕</span> {{ t('pro.card.copyBlocked') }}
      </div>
      <div v-if="isDead" class="pro-key-card__dead-actions">
        <button class="pro-key-card__dead-restore" type="button" @click="emit('restore', keyItem)">{{ t('pro.card.restore') }}</button>
        <button class="pro-key-card__dead-delete" type="button" @click="emit('open-confirm', keyItem, 'del')">{{ t('pro.card.delete') }}</button>
      </div>
      <div class="pro-key-card__footer-spacer"></div>
      <button v-if="isFree && !isDead" class="pro-key-card__upgrade" type="button" @click="emit('open-upgrade', keyItem)">
        {{ t('pro.card.upgrade') }}
      </button>
      <button v-if="isBlocked" class="pro-key-card__pay" type="button" @click="emit('open-pay')">
        {{ t('pro.card.pay') }}
      </button>
      <button v-if="isWarn" class="pro-key-card__extend" type="button" @click="emit('open-extend', keyItem)">
        {{ t('pro.card.extend') }}
      </button>
      <button
        v-if="!isDead"
        :title="t('pro.card.actions')"
        class="pro-key-card__gear"
        type="button"
        @click.stop="emit('toggle-menu', keyItem.id)"
      >
        ⚙
      </button>
      <ProKeyMenu
        v-if="menuOpen"
        :has-name="hasName"
        :has-note="hasNote"
        :has-sold="Boolean(keyItem.sold)"
        :is-free="isFree"
        variant="card"
        @close="emit('close-menu', keyItem)"
        @copy="emit('copy', keyItem)"
        @deactivate="emit('open-confirm', keyItem, 'off')"
        @delete="emit('open-confirm', keyItem, 'del')"
        @extend="emit('open-extend', keyItem)"
        @note="emit('open-note', keyItem)"
        @rename="emit('open-name', keyItem)"
        @sold="emit('open-sold', keyItem)"
        @upgrade="emit('open-upgrade', keyItem)"
      />
    </div>
  </div>
</template>

<script setup>
import {computed, toRef} from 'vue';
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
});

const emit = defineEmits([
  'copy', 'restore', 'toggle-menu', 'close-menu',
  'open-sold', 'open-name', 'open-note', 'open-extend',
  'open-upgrade', 'open-confirm', 'open-pay',
]);

const {t} = useI18n();
const {
  status, isFree, isDead, isBlocked, isWarn,
  hasName, hasNote, displayName, statusWord, tariffLabel,
  untilText, untilLabel, lastLabel, gbText,
  profitText, profitTone, soldText, invoiceLabel, invoiceValue,
} = useProKeyView(toRef(props, 'keyItem'));

const canCopy = computed(() => !isDead.value && !isBlocked.value);
</script>
