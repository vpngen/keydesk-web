<template>
  <div class="profile__card">
    <div class="profile__card-headline">
      <div
        v-if="!is_vip"
        :class="`${status} tooltip`"
        :data-user="`${profileCardStatus.statusHint[status]}`"
        class="profile__card-status"
      />
      <div class="profile__card-logo">
							<span class="profile__card-icon">
								<SvgIcon :name="is_vip ? 'card-logo-vip' : index === 0 ? 'icon-card-brigadier' : 'icon-card'"/>
							</span>
      </div>
      <a :href="personDescLink" class="profile__card-name" target="_blank">
        {{ userName }}
      </a>
    </div>
    <ul class="profile__card-features">
      <li v-if="lastVisitHour || is_vip" class="profile__card-feature">
        <b>Последний визит</b>
        <span>{{ is_vip ? 'Недавно' : formattedDate(lastVisitHour) }}</span>
      </li>
      <li v-if="monthlyQuotaRemainingGB !== undefined" class="profile__card-feature">
        <b>Лимит трафика</b>
        <span>{{ monthlyQuotaRemainingGB }} GB</span>
      </li>
      <li class="profile__card-feature">
        <div class="profile__status-caption">
          <b>Статус:</b>
        </div>
        <div :class="`profile__status-color-${status}`" class="profile__status-color"/>
        <div class="profile__status-description">
          {{ profileCardStatus.statusName[status] }}
        </div>
      </li>
      <li v-if="false" class="profile__card-feature">
        <b>
          <template v-if="lastVisitSubnet">
            <SvgIcon name="icon-de"/>
            <span>{{ lastVisitSubnet }}</span>
          </template>
        </b>
      </li>
    </ul>
    <div class="profile__card-actions">
      <button
        v-if="index !== 0 && !is_vip"
        :disabled="highlightedElementProperties?.secondUserProfileCard.disabled"
        class="profile__card-button"
        @click="$emit('openDialogUser')"
      >
        Удалить
      </button>
      <button
        v-if="is_vip"
        class="profile__card-button profile__card-button--gold"
        @click="$emit('openViewKey')"
      >
        Просмотреть ключ
      </button>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from "@/components/SvgIcon.vue";
import {profileCardStatus} from "@/assets/constants/profileConstants";

defineProps({
  is_vip: {
    required: true,
    type: Boolean
  },
  status: {
    required: false,
    type: String
  },
  userName: {
    required: true,
    type: String
  },
  personDescLink: {
    required: false,
    type: String,
  },
  monthlyQuotaRemainingGB: {
    required: false,
    type: Number
  },
  lastVisitHour: {
    required: false,
    type: String
  },
  lastVisitSubnet: {
    required: false,
    type: String
  },
  index: {
    required: true,
    type: Number
  },
  highlightedElementProperties: {
    required: true,
    type: Object
  }
});

defineEmits(['openDialogUser', 'openViewKey']);

const formattedDate = (data) => {
  const date = new Date(data);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, '0');

  return `${day}.${month}.${year} ~${hours}:00`;
};
</script>
