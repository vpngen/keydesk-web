<template>
  <div class="profile__cards">
    <ProfileCardSkeleton v-if="isLoading"/>
    <ProfileCard
      v-else
      ref="firstUserProfileCard"
      :class="`${highlightedElementProperties.firstUserProfileCard?.highlight ?? ''}`"
      :highlighted-element-properties="highlightedElementProperties"
      :index="0"
      :is_vip="false"
      :last-visit-hour="firstUser?.LastVisitHour"
      :last-visit-subnet="firstUser?.LastVisitSubnet"
      :monthly-quota-remaining-g-b="firstUser?.MonthlyQuotaRemainingGB"
      :status="firstUser?.Status"
      :user-name="firstUser?.UserName ?? ''"
    />

    <template v-if="isVip && vipUsersList">
      <template v-for="(vipUser, index) in vipUsersList" :key="vipUser.user_id">
        <ProfileCard
          :highlighted-element-properties="highlightedElementProperties"
          :index="index + 1"
          :is_vip="true"
          :monthly-quota-remaining-g-b="100000"
          :user-name="t('cabinet.profile.vipKey', { n: index + 1 })"
          class="profile__card--vip"
          status="green"
          @open-dialog-user="$emit('openDialogUser')"
          @open-view-key="$emit('openViewKey', index)"
        />
      </template>
    </template>

    <template v-if="isLoading">
      <ProfileCardSkeleton v-for="n in pageSize" :key="`skeleton-${n}`"/>
    </template>
    <template v-else-if="users.length">
      <template v-for="(user, index) in users" :key="user.UserID">
        <ProfileCard
          :ref="(el) => { if (currentPage === 1 && index === 0) secondUserProfileCard = el }"
          :class="`${index === 0 ? highlightedElementProperties.secondUserProfileCard?.highlight ?? '' : ''}`"
          :highlighted-element-properties="highlightedElementProperties"
          :index="index + 1"
          :is_vip="false"
          :last-visit-hour="user?.LastVisitHour"
          :last-visit-subnet="user?.LastVisitSubnet"
          :monthly-quota-remaining-g-b="user?.MonthlyQuotaRemainingGB"
          :person-desc-link="user?.PersonDescLink"
          :status="user?.Status"
          :user-name="user?.UserName ?? ''"
          @open-dialog-user="$emit('openDialogUser', user.UserID)"
        />
      </template>
    </template>
    <div v-if="!isLoading" class="profile__add" @click="$emit('addUser')">
      <div class="profile__add-icon">
        <SvgIcon name="icon-add"/>
      </div>
      <p class="profile__add-text">
        {{ t('cabinet.profile.addUserLine1') }}<br>{{ t('cabinet.profile.addUserLine2') }}
      </p>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import SvgIcon from '@/components/SvgIcon.vue';
import ProfileCard from './ProfileCard.vue';
import ProfileCardSkeleton from './ProfileCardSkeleton.vue';

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  isVip: {
    type: Boolean,
    default: false,
  },
  vipUsersList: {
    type: Array,
    default: () => [],
  },
  firstUser: {
    type: Object,
    default: null,
  },
  users: {
    type: Array,
    default: () => [],
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
  highlightedElementProperties: {
    type: Object,
    default: () => ({}),
  },
});

defineEmits(['addUser', 'openDialogUser', 'openViewKey']);

const {t} = useI18n();

const firstUserProfileCard = ref(null);
const secondUserProfileCard = ref(null);

defineExpose({
  firstUserProfileCard,
  secondUserProfileCard,
});
</script>
