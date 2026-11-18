<template>
  <div :class="['profile__card', 'kg-card', {'kg-card--vip': is_vip}]">
    <span :class="`kg-card__badge kg-card__badge--${status || 'green'}`" :title="statusHint">
      <svg v-if="status === 'red'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <path d="M7 7l10 10M17 7L7 17"/>
      </svg>
      <svg v-else-if="status === 'grey' || status === 'black'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <path d="M6 12h12"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5"/>
      </svg>
    </span>

    <span class="kg-card__paw">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <ellipse cx="6.3" cy="9.4" rx="2" ry="2.7" transform="rotate(-20 6.3 9.4)"/>
        <ellipse cx="10.1" cy="5.7" rx="2" ry="2.8"/>
        <ellipse cx="14.5" cy="5.9" rx="2" ry="2.8"/>
        <ellipse cx="18.3" cy="9.7" rx="2" ry="2.7" transform="rotate(20 18.3 9.7)"/>
        <path d="M12.2 10.6c3 0 4.5 2.2 5.6 4.1 1.2 1.9.6 4.4-1.8 4.7-1.6.2-2.5-.9-3.8-.9s-2.2 1.1-3.8.9c-2.4-.3-3-2.8-1.8-4.7 1.1-1.9 2.6-4.1 5.6-4.1z"/>
      </svg>
    </span>

    <a
      :href="personDescLink || undefined"
      :target="personDescLink ? '_blank' : undefined"
      class="kg-card__name"
      rel="noopener"
    >
      <template v-if="is_vip">
        <span class="kg-card__name-vip">VIP</span>
        <span class="kg-card__name-line2">{{ vipName }}</span>
      </template>
      <template v-else>
        <span class="kg-card__name-line1">{{ nameParts[0] }}</span>
        <span v-if="nameParts[1]" class="kg-card__name-line2">{{ nameParts[1] }}</span>
      </template>
    </a>

    <ul class="kg-card__rows">
      <li v-if="lastVisitHour || is_vip" class="kg-card__row">
        <span class="kg-card__row-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <circle cx="12" cy="12" r="9.5"/>
            <path d="M12 7v5.5l3.5 2"/>
          </svg>
        </span>
        <span class="kg-card__row-sep"/>
        <span class="kg-card__row-text">
          <b>{{ t('cabinet.card.lastVisit') }}</b>
          <span>{{ is_vip ? t('cabinet.card.lastVisitVip') : formattedDate(lastVisitHour) }}</span>
        </span>
      </li>
      <li v-if="monthlyQuotaRemainingGB !== undefined" class="kg-card__row">
        <span class="kg-card__row-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="15" width="3" height="6" rx="1"/>
            <rect x="8" y="11" width="3" height="10" rx="1"/>
            <rect x="13" y="7" width="3" height="14" rx="1"/>
            <rect x="18" y="3" width="3" height="18" rx="1"/>
          </svg>
        </span>
        <span class="kg-card__row-sep"/>
        <span class="kg-card__row-text">
          <b>{{ t('cabinet.card.trafficLimit') }}</b>
          <span>{{ formattedQuota }} GB</span>
        </span>
      </li>
      <li class="kg-card__row">
        <span class="kg-card__row-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round">
            <path d="M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.8l6.1-.7z"/>
          </svg>
        </span>
        <span class="kg-card__row-sep"/>
        <span class="kg-card__row-text">
          <b>{{ t('cabinet.card.statusLabel') }}</b>
          <span class="kg-card__status">
            <b>{{ statusName }}</b>
            <i :class="`kg-card__dot kg-card__dot--${status || 'green'}`"/>
          </span>
        </span>
      </li>
    </ul>

    <div class="kg-card__actions">
      <button
        v-if="index !== 0 && !is_vip"
        :disabled="highlightedElementProperties?.secondUserProfileCard?.disabled"
        class="kg-card__button"
        type="button"
        @click="$emit('openDialogUser')"
      >
        {{ t('cabinet.card.remove') }}
      </button>
      <button
        v-if="is_vip"
        class="kg-card__button kg-card__button--gold"
        type="button"
        @click="$emit('openViewKey')"
      >
        {{ t('cabinet.card.viewKey') }}
      </button>
    </div>
  </div>
</template>

<script setup>
// Key card of the Kyrgyzstan partner skin. Same props and emits as
// ProfileCard.vue, so ProfileCardsList can swap the two by theme; the base card
// is not touched.
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {useDisplayPersonName} from '@/composables/useDisplayPersonName';

const {t} = useI18n();
const {displayName} = useDisplayPersonName();

const props = defineProps({
  is_vip: {type: Boolean, default: false},
  status: {type: String, default: ''},
  userName: {type: String, default: ''},
  personDescLink: {type: String, default: ''},
  monthlyQuotaRemainingGB: {type: Number, default: undefined},
  lastVisitHour: {type: String, default: ''},
  lastVisitSubnet: {type: String, default: ''},
  index: {type: Number, default: 0},
  highlightedElementProperties: {type: Object, default: () => ({})},
});

defineEmits(['openDialogUser', 'openViewKey']);

const shownName = computed(() => displayName(props.userName) || '');

// "Хитрый Илбирс" -> white "ХИТРЫЙ", blue "ИЛБИРС"; a one-word name stays white.
const nameParts = computed(() => {
  const parts = shownName.value.trim().split(/\s+/);
  return [parts[0] || '', parts.slice(1).join(' ')];
});

// The VIP card shows "VIP" above the key name; the "#1" of the first key is noise.
const vipName = computed(() => shownName.value.replace(/\s*#1$/, ''));

const statusName = computed(() => (props.status ? t(`cabinet.userStatus.${props.status}.name`) : ''));
const statusHint = computed(() => (props.status ? t(`cabinet.userStatus.${props.status}.hint`) : ''));

const formattedQuota = computed(() => {
  const value = Number(props.monthlyQuotaRemainingGB);
  return Number.isFinite(value) ? value.toLocaleString('ru-RU') : props.monthlyQuotaRemainingGB;
});

const formattedDate = (data) => {
  const date = new Date(data);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, '0');
  return `${day}.${month}.${year} ~${hours}:00`;
};
</script>
