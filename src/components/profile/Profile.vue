<template>
  <div class="profile">
    <ProfileHeader
      ref="headerRef"
      :brigadier-name="usersList?.[0]?.UserName"
      :is-loading="isUsersLoading"
      :status-list="statusList"
      :highlighted-element-properties="highlightedElementProperties"
      @add-user="addUserHandler"
    />
    <ProfileWarning
      v-if="!isVIP && isInstructionHidden && messageShow"
      @close="messageClose = true"
    />
    <ProfileCardsList
      ref="cardsListRef"
      :is-loading="isUsersLoading"
      :is-vip="isVIP"
      :vip-users-list="vipUsersList"
      :first-user="filteredUsers[0]"
      :users="paginatedUsers"
      :current-page="usersPage"
      :page-size="usersPageSize"
      :highlighted-element-properties="highlightedElementProperties"
      @add-user="addUserHandler"
      @open-dialog-user="openDialogUser"
      @open-view-key="openViewKey"
    />
    <ProfilePagination
      v-if="!isUsersLoading"
      :current-page="usersPage"
      :total-pages="usersPagesCount"
      @update:page="setUsersPage"
    />
    <ProfileTabs :chart-list="chartList"/>
  </div>
  <teleport to="#app">
    <DialogUser v-if="showDialogUser" :userId="deletedUserId" @close="closeDialogUser" @removeUser="removeUser"/>
    <DialogOs
      v-if="showDialogOs"
      @close="toggleDialogOsHandler"
      @next="openDialogQrCodeHandler"
      @skip="skipDialogConfig"
    />
    <DialogOther
      v-if="showDialogOther"
      :chosenClient="chosenClient"
      @back="openDialogQrCodeHandler('linux')"
      @close="toggleDialogOtherHandler"
      @next="switchDialogConfigHandler"
    />
    <DialogQrCode
      v-if="showDialogQrCode"
      :chosenOS="chosenOS"
      :configName="configName"
      :title="titleDialogQrCode"
      :userData="userData"
      @close="closeDialogQrCodeHandler"
      @others="returnToOthersHandler"
    />
    <DialogConfig
      v-if="showDialogConfig"
      :clientName="chosenClient"
      :userData="userData"
      @back="switchDialogConfigHandler"
      @close="togleDialogConfigHandler"
    />
    <DialogSelectConfig
      v-if="showDialogSelectConfig"
      @close="closeDialogSelectConfig"
      @select="handleConfigSelect"
    />
    <PopupError v-if="isError"/>
    <DialogVipConfig
      v-if="showDialogVipConfig"
      :title="userData.title"
      :user-id="userData.userId"
      :vip-config="userData.vipConfig"
      @close="closeDialogVipConfig"
    />
  </teleport>
  <WelcomePage
    v-if="usersList.length && !isInstructionHidden"
    :elementStepFive="cardsListRef?.secondUserProfileCard"
    :elementStepSix="headerRef?.searchButton"
    :elementStepThree="headerRef?.buttonAddUser"
    :elementStepTwo="cardsListRef?.firstUserProfileCard"
    @darkenElement="darkenElement"
    @getUsers="getUsers()"
    @highlightElement="highlightElement"
    @toggleDisable="toggleDisableAll"
  />
</template>

<script setup>
import axios from 'axios';
import {storeToRefs} from 'pinia';
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {mockedDataProfile, sortingMap, statusMap} from '@/assets/constants/profileConstants.js';
import {generateHighlightedElementProperties} from '@/assets/helpers/profileHelpers';
import {apiLink} from '@/const/api';
import {useAuthStore} from '@/store/auth';
import {useLoadingStore} from '@/store/loading';
import {useProfileStore} from '@/store/profile';
import {useUsersStore} from '@/store/users';
import {useUsersFilterStore} from '@/store/usersFilter';
import {isConstructionError} from '@/utils/apiErrors';
import {personNameMatchesFilter} from '@/utils/personNameDisplay';
import {safeGetItem} from '@/utils/safeStorage';
import vpnSystemsConfig from '../../../vpn_sistems_config.json';
import DialogConfig from '@/components/dialogs/DialogConfig.vue';
import DialogOs from '@/components/dialogs/DialogOs.vue';
import DialogOther from '@/components/dialogs/DialogOther.vue';
import DialogQrCode from '@/components/dialogs/DialogQrCode.vue';
import DialogSelectConfig from '@/components/dialogs/DialogSelectConfig.vue';
import DialogUser from '@/components/dialogs/DialogUser.vue';
import DialogVipConfig from '@/components/dialogs/DialogVipConfig.vue';
import PopupError from '@/components/PopupError.vue';
import WelcomePage from '@/components/welcome/WelcomePage.vue';
import ProfileCardsList from './ProfileCardsList.vue';
import ProfileHeader from './ProfileHeader.vue';
import ProfilePagination from './ProfilePagination.vue';
import ProfileTabs from './ProfileTabs.vue';
import ProfileWarning from './ProfileWarning.vue';

const {t, locale} = useI18n();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const usersStore = useUsersStore();
const loadingStore = useLoadingStore();
const filterStore = useUsersFilterStore();
const {usersList, vipUsersList} = storeToRefs(usersStore);
const {isVIP, urlVIP, uuid} = storeToRefs(profileStore);
const {
  filterText: filterUserText,
  selectedSort: selectedFilterSort,
  selectedStatus: selectedFilterStatus,
  currentPage: usersPage,
} = storeToRefs(filterStore);
const usersPageSize = filterStore.pageSize;

const headerRef = ref(null);
const cardsListRef = ref(null);
const userData = ref({});
const isError = ref(false);
const statusList = ref();
const chartList = ref(false);
const messageClose = ref(false);
const isInstructionHidden = ref(true);
const isUsersLoading = ref(true);
const highlightedElementProperties = ref(generateHighlightedElementProperties());
const vipInterval = ref(null);

const showDialogOs = ref(false);
const showDialogOther = ref(false);
const showDialogQrCode = ref(false);
const showDialogConfig = ref(false);
const showDialogSelectConfig = ref(false);
const showDialogVipConfig = ref(false);
const showDialogUser = ref(false);
const titleDialogQrCode = ref('');
const chosenOS = ref(null);
const chosenClient = ref(null);
const configName = ref('');
const deletedUserId = ref(null);

const messageShow = computed(() =>
  !messageClose.value && chartList.value && chartList.value.ActiveUsers[11].Value < 5
);

const filteredUsers = computed(() => {
  const filter = filterUserText.value;

  if (!usersList.value.length || !(isInstructionHidden.value || safeGetItem('isInstructionHidden'))) {
    return usersList.value;
  }

  const [firstElement, ...userListCopy] = usersList.value;
  let result = userListCopy;

  const status = selectedFilterStatus.value;
  if ([statusMap.green, statusMap.black, statusMap.grey, statusMap.yellow, statusMap.red].includes(status)) {
    result = result.filter((user) => user.Status.toLowerCase().includes(status));
  }

  switch (selectedFilterSort.value) {
    case sortingMap.nameAsc:
      result = result.sort((a, b) => a.UserName.localeCompare(b.UserName));
      break;
    case sortingMap.nameDesc:
      result = result.sort((a, b) => b.UserName.localeCompare(a.UserName));
      break;
    case sortingMap.dateAsc:
      result = result.sort((a, b) => a?.CreatedAt.localeCompare(b?.CreatedAt));
      break;
    case sortingMap.dateDesc:
      result = result.sort((a, b) => b?.CreatedAt.localeCompare(a?.CreatedAt));
      break;
  }

  result = result.filter((user) =>
    personNameMatchesFilter(user.UserName, filter, locale.value)
  );

  return [firstElement, ...result];
});

const usersPagesCount = computed(() =>
  Math.max(1, Math.ceil(Math.max(0, filteredUsers.value.length - 1) / usersPageSize))
);

const paginatedUsers = computed(() => {
  const rest = filteredUsers.value.slice(1);
  const start = (usersPage.value - 1) * usersPageSize;
  return rest.slice(start, start + usersPageSize);
});

watch(usersPagesCount, (count) => {
  if (usersPage.value > count) {
    filterStore.setPage(count);
  }
});

watch(isVIP, (vip) => {
  if (vip && !vipInterval.value) {
    vipInterval.value = setInterval(() => getVipUsers(), 10000);
  }
  if (!vip && vipInterval.value) {
    clearInterval(vipInterval.value);
    vipInterval.value = null;
  }
}, {immediate: true});

const getVipUsers = async () => {
  await axios.post('https://' + urlVIP.value)
    .then((r) => {
      if (r.data?.data) {
        vipUsersList.value = r.data.data;
      }
    })
    .catch((error) => {
      if (isConstructionError(error)) return;
      console.error(error);
    });
};

const getUsers = async () => {
  isUsersLoading.value = true;
  try {
    usersList.value = await axios.get(`${apiLink}/user`)
      .then((r) => r.data)
      .catch(async (error) => {
        if (isConstructionError(error)) return;
        if (error.response?.status === 401) {
          await authStore.fetchToken({force: true});
          getUsers();
        } else {
          isError.value = true;
          console.error(error);
        }
      });
    if (isVIP.value && urlVIP.value) {
      await getVipUsers();
    }
    if (isInstructionHidden.value || safeGetItem('isInstructionHidden')) {
      statusList.value = new Set(usersList.value?.map((user) => user.Status));
    }
  } finally {
    isUsersLoading.value = false;
  }
};

const getChart = async () => {
  chartList.value = await axios.get(`${apiLink}/users/stats`)
    .then((r) => r.data)
    .catch(async (error) => {
      if (isConstructionError(error)) return;
      if (error.response?.status === 401) {
        await authStore.fetchToken({force: true});
        getChart();
      } else {
        isError.value = true;
        console.error(error);
      }
    }).finally(() => {
      loadingStore.hide();
    });
};

const bootstrap = async () => {
  loadingStore.show();
  try {
    await authStore.fetchToken();

    getChart();

    if (isVIP.value) {
      isInstructionHidden.value = true;
    } else {
      isInstructionHidden.value = safeGetItem('isInstructionHidden');
    }

    if (isInstructionHidden.value) {
      getUsers();
    } else {
      usersList.value = mockedDataProfile;
      isUsersLoading.value = false;
    }
  } catch (error) {
    if (isConstructionError(error)) return;
    console.error(error);
    isUsersLoading.value = false;
  } finally {
    loadingStore.hide();
  }
};

const addUser = async () => {
  loadingStore.show();
  await axios.post(`${apiLink}/user`, {}, {
    responseType: 'application/json',
    headers: {accept: 'application/json'},
  }).then((r) => {
    userData.value = JSON.parse(r.data);
    getUsers();
  }).catch(async (error) => {
    if (isConstructionError(error)) return;
    if (error.response?.status === 401) {
      await authStore.fetchToken({force: true});
      addUser();
    } else {
      isError.value = true;
      console.error(error);
    }
  }).finally(() => {
    loadingStore.hide();
  });
};

const removeUser = async (id) => {
  loadingStore.show();
  await axios.delete(`${apiLink}/user/${id}`)
    .then(() => {
      showDialogUser.value = false;
      deletedUserId.value = null;
      getUsers();
    }).catch(async (error) => {
      if (isConstructionError(error)) return;
      if (error.response?.status === 401) {
        await authStore.fetchToken({force: true});
        removeUser(deletedUserId.value);
      } else {
        isError.value = true;
        console.error(error);
      }
    }).finally(() => {
      loadingStore.hide();
    });
};

const closeDialogSelectConfig = () => {
  showDialogSelectConfig.value = false;
};

const closeDialogUser = () => {
  showDialogUser.value = false;
};

const closeDialogVipConfig = () => {
  showDialogVipConfig.value = false;
};

const closeDialogQrCodeHandler = () => {
  showDialogQrCode.value = !showDialogQrCode.value;
};

const togleDialogConfigHandler = () => {
  showDialogConfig.value = !showDialogConfig.value;
};

const toggleDialogOtherHandler = () => {
  showDialogOther.value = !showDialogOther.value;
};

const toggleDialogOsHandler = () => {
  showDialogOther.value = false;
  showDialogOs.value = !showDialogOs.value;
};

const returnToOthersHandler = () => {
  showDialogQrCode.value = !showDialogQrCode.value;
  showDialogOther.value = true;
};

const skipDialogConfig = () => {
  showDialogOs.value = !showDialogOs.value;
  toggleDialogOtherHandler();
};

const switchDialogConfigHandler = (configType) => {
  toggleDialogOtherHandler();
  togleDialogConfigHandler();
  if (configType) {
    chosenClient.value = configType.value;
  }
};

const openDialogUser = (id) => {
  deletedUserId.value = id;
  showDialogUser.value = true;
};

const openViewKey = (vipUserIndex) => {
  const vipUser = vipUsersList.value[vipUserIndex];
  userData.value = {
    title: t('cabinet.profile.vipKey', {n: vipUserIndex + 1}),
    vipConfig: vipUser.good_content,
    userId: vipUser.user_id,
  };
  showDialogVipConfig.value = true;
};

const openDialogQrCodeHandler = (type) => {
  const osType = typeof type === 'string' ? type : type.value;
  chosenOS.value = osType;
  configName.value = vpnSystemsConfig.system_defaults[osType];
  if (osType === 'other') {
    showDialogOs.value = !showDialogOs.value;
    showDialogOther.value = !showDialogOther.value;
  } else {
    titleDialogQrCode.value = osType;
    showDialogOther.value = false;
    showDialogQrCode.value = !showDialogQrCode.value;
  }
};

const handleConfigSelect = async (configType) => {
  closeDialogSelectConfig();
  if (configType === 'vip') {
    return window.open(`https://t.me/vpngeneratorbot?start=${uuid.value}`, '_blank');
  }
  await addUser();
  openDialogQrCodeHandler('linux');
};

const addUserHandler = async () => {
  if (isVIP.value) {
    showDialogSelectConfig.value = true;
  } else {
    await handleConfigSelect('linux');
  }
};

const setUsersPage = (page) => {
  if (page < 1 || page > usersPagesCount.value) return;
  filterStore.setPage(page);
  nextTick(() => {
    headerRef.value?.headlineRef?.scrollIntoView({behavior: 'smooth', block: 'start'});
  });
};

const highlightElement = (path) => {
  highlightedElementProperties.value[path].highlight = 'highlight';
};

const darkenElement = (path) => {
  highlightedElementProperties.value[path].highlight = '';
};

const toggleDisableAll = () => {
  for (const key in highlightedElementProperties.value) {
    const entry = highlightedElementProperties.value[key];
    if (Object.prototype.hasOwnProperty.call(entry, 'disabled')) {
      entry.disabled = !entry.disabled;
    }
  }
};

onMounted(() => {
  bootstrap();
});

onUnmounted(() => {
  if (vipInterval.value) {
    clearInterval(vipInterval.value);
  }
});
</script>
