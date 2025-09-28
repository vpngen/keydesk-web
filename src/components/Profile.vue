<template>
  <div class="profile">
    <div class="profile__headline">
      <h2 class="profile__title">
        {{ data.profile.headline.title }} {{ usersList?.length ? usersList[0].UserName : 'Brigadier' }}
      </h2>
      <div class="profile__search">
        <div class="profile__filter-block">
          <FiltersPanel
            v-if="statusList"
            :selectedFilterSort="selectedFilterSort"
            :selectedFilterStatus="selectedFilterStatus"
            :statusList="statusList"
            @update:selectedFilterSort="selectedFilterSort = $event"
            @update:selectedFilterStatus="selectedFilterStatus = $event"
          />
        </div>
        <div class="profile__search-block">
          <div :class="highlightedElementProperties.searchButton.highlight" class="profile__add-label">
            <input
              ref="searchButton"
              v-model="filterUserText"
              :disabled="highlightedElementProperties.searchButton.disabled"
              class="profile__search-input"
              placeholder="Поиск"
              type="text"
            />
            <button :disabled="highlightedElementProperties.searchButton.disabled" class="button button--search-button">
              {{ data.profile.headline.search }}
            </button>
          </div>
          <div class="profile__add-button">
            <button id="welcome-add-end" ref="buttonAddUser"
                    :class="highlightedElementProperties.buttonAddUser.highlight"
                    :disabled="highlightedElementProperties.buttonAddUser.disabled" class="button"
                    @click="addUserHandler">{{ data.profile.headline.button }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isInstructionHidden && messageShow" class="profile__message">
      <div class="profile__message-icon">
        <SvgIcon name="icon-status-deactive"/>
      </div>
      <div class="profile__message-text">
        Через неделю после создания бригада будет закрыта, если в ней будет меньше 10 активных пользователей
      </div>
      <div class="profile__message-close" @click="messageClose = true">
        <SvgIcon name="icon-close"/>
      </div>
    </div>
    <div class="profile__cards">
      <ProfileCard
        :class="`${highlightedElementProperties[getRefForHighlight(0)].highlight}`"
        :highlighted-element-properties="highlightedElementProperties"
        :index="0"
        :is_vip="false"
        :last-visit-hour="filteredUsers[0]?.LastVisitHour"
        :last-visit-subnet="filteredUsers[0]?.LastVisitSubnet"
        :monthly-quota-remaining-g-b="filteredUsers[0]?.MonthlyQuotaRemainingGB"
        :status="filteredUsers[0]?.Status"
        :user-name="filteredUsers[0]?.UserName"
      />

      <template v-for="(vipUser, index) in vipUsersList" v-if="isVIP && vipUsersList" :key="vipUser.user_id">
        <ProfileCard
          :class="`${highlightedElementProperties[getRefForHighlight(index)].highlight}`"
          :highlighted-element-properties="highlightedElementProperties"
          :index="index + 1"
          :is_vip="true"
          :monthly-quota-remaining-g-b="100000"
          :user-name="`VIP-ключ #${index+1}`"
          class="profile__card--vip"
          status="green"
          @open-dialog-user="openDialogUser"
          @open-view-key="openViewKey(index)"
        />
      </template>

      <template v-for="(user, index) in filteredUsers.slice(1)" v-if="filteredUsers.length > 1" :key="user.UserID">
        <ProfileCard
          :class="`${highlightedElementProperties[getRefForHighlight(index)].highlight}`"
          :highlighted-element-properties="highlightedElementProperties"
          :index="index + 1"
          :is_vip="false"
          :last-visit-hour="user?.LastVisitHour"
          :last-visit-subnet="user?.LastVisitSubnet"
          :monthly-quota-remaining-g-b="user?.MonthlyQuotaRemainingGB"
          :person-desc-link="user?.PersonDescLink"
          :status="user?.Status"
          :user-name="user?.UserName"
          @open-dialog-user="openDialogUser(user.UserID)"
        />
      </template>
      <div class="profile__add" @click="addUserHandler">
        <div class="profile__add-icon">
          <SvgIcon name='icon-add'/>
        </div>
        <p class="profile__add-text">
          Добавить<br>пользователя
        </p>
      </div>
    </div>
    <div class="profile__data swiper-container">
      <h2 class="profile__title">
        {{ data.profile.title }}
      </h2>
      <div class="profile__select swiper-wrapper">
        <div class="profile__option swiper-slide">
          <button :class="{'is-select': showTab === 1}" class="button button--option1" data-button="1"
                  @click="showTab = 1">Статистика бригады
          </button>
        </div>
        <div class="profile__option swiper-slide">
          <button :class="{'is-select': showTab === 2}" class="button button--option1" data-button="2"
                  @click="showTab = 2">Инструкции
          </button>
        </div>
        <div class="profile__option swiper-slide">
          <button :class="{'is-select': showTab === 3}" class="button button--option1" data-button="3"
                  @click="showTab = 3">Какие данные мы собираем?
          </button>
        </div>
        <div class="profile__option swiper-slide">
          <button :class="{'is-select': showTab === 4}" class="button button--option3" data-button="4"
                  @click="showTab = 4">FAQ
          </button>
        </div>
      </div>
      <div class="profile__tabs">
        <div v-show="showTab === 1" class="profile__tab" data-tab="1">
          <div class="profile__chart">
            <div class="profile__chart-graph">
              <div class="profile__chart-title">
                За год&nbsp;
                <div class="profile__chart-select">
									<span v-if="chartSelect === 1" @click.stop="chartSelectShow = chartSelectShow.value ? false : true">
										кол-во активных пользователей
									</span>
                  <span v-if="chartSelect === 2" @click.stop="chartSelectShow = chartSelectShow.value ? false : true">
										общее кол-во пользователей
									</span>
                  <span v-if="chartSelect === 3" @click.stop="chartSelectShow = chartSelectShow.value ? false : true">
										объем трафика
									</span>
                </div>
                <div v-if="chartSelectShow" ref="chartOptionsRef" class="profile__chart-options">
									<span v-if="chartSelect !== 1" @click.stop="chartSelected(1)">
										кол-во активных пользователей
									</span>
                  <span v-if="chartSelect !== 2" @click.stop="chartSelected(2)">
										общее кол-во пользователей
									</span>
                  <span v-if="chartSelect !== 3" @click.stop="chartSelected(3)">
										объем трафика
									</span>
                </div>
              </div>
              <div ref='chartScroll' class="profile__chart-scroll">
                <div class="profile__chart-line">
                  <ChartLine v-if="chartList" :select="chartSelect" :stats="chartList"/>
                </div>
              </div>
            </div>
            <div class="profile__chart-data">
              <div class="profile__chart-title">
                Текущий месяц
              </div>
              <div class="profile__chart-buttons">
                <button :class="{'is-select': chartSelect === 1}" class="profile__chart-button"
                        @click="chartSelected(1)">
									<span v-if="chartList" class="profile__chart-num">
										{{ chartList.ActiveUsers[11].Value }}
										<span v-if="iconActiveUsers">
											<SvgIcon :name="iconActiveUsers"/>
											</span>
									</span>
                  <span class="chart-text">
										Кол-во активных пользователей
									</span>
                </button>
                <button :class="{'is-select': chartSelect === 2}" class="profile__chart-button"
                        @click="chartSelected(2)">
									<span v-if="chartList" class="profile__chart-num">
										{{ chartList.TotalUsers[11].Value }}
										<span v-if="iconTotalUsers">
											<SvgIcon :name="iconTotalUsers"/>
											</span>
									</span>
                  <span class="profile__chart-text">
										Общее кол-во пользователей
									</span>
                </button>
                <button :class="{'is-select': chartSelect === 3}" class="profile__chart-button"
                        @click="chartSelected(3)">
									<span v-if="chartList" class="profile__chart-num">
										{{ chartList.TotalTrafficGB[11].Value }}Gb
										<span v-if="iconTotalTraffic">
											<SvgIcon :name="iconTotalTraffic"/>
										</span>
									</span>
                  <span class="profile__chart-text">
										Объем трафика
									</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-show="showTab === 2" class="profile__tab" data-tab="2">
          <div class="profile__directions">
            <div class="profile__directions-title">
              Выбор по устройству для основного протокола и клиента
            </div>
            <div class="profile__directions-cards swiper-container">
              <div class="profile__directions-wrapper swiper-wrapper">
                <template v-for="card in profileDirectionsCards.selectByDevice">
                  <a :href="card.href" class="profile__directions-slide swiper-slide" target="_blank">
                    <div :class="`icon-${card.image}`" class="profile__directions-image"/>
                    <div class="profile__directions-label">
                      {{ card.label }}
                    </div>
                    <div class="profile__directions-arrow"/>
                  </a>
                </template>
              </div>
            </div>
            <div class="profile__directions-title">
              Выбор по протоколу
            </div>
            <div class="profile__directions-cards swiper-container">
              <div class="profile__directions-wrapper swiper-wrapper">
                <template v-for="card in profileDirectionsCards.selectByProtocol">
                  <a :href="card.href" class="profile__directions-slide swiper-slide" target="_blank">
                    <div :class="`icon-${card.image}`" class="profile__directions-image"/>
                    <div class="profile__directions-label">
                      {{ card.label }}
                    </div>
                    <div class="profile__directions-arrow"/>
                  </a>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div v-show="showTab === 3" class="profile__tab" data-tab="3">
          <div class="profile__table">
            <div class="profile__table-head">
              <div class="profile__table-title">
                Тип данных
              </div>
              <div class="profile__table-column">
                Юзер
              </div>
              <div class="profile__table-column">
                Бригадир
              </div>
            </div>
            <template v-for="line in data.dataCollection">
              <div class="profile__table-line">
                <div class="profile__table-title">
                  {{ line.type }}
                </div>
                <div :class="{'tooltip': line.user}" :data-user="line.user" class="profile__table-column">
                  <SvgIcon :name="`icon-status-${line.user ? 'on' : 'off'}`"/>
                </div>
                <div :class="{'tooltip': line.brigadier}" :data-user="line.brigadier" class="profile__table-column">
                  <SvgIcon :name="`icon-status-${line.brigadier ? 'on' : 'off'}`"/>
                </div>
              </div>
            </template>
          </div>
          <p class="profile__chart-note">
            Нам эти данные не&nbsp;нужны, но&nbsp;это минимально необходимый по&nbsp;закону набор данных для
            запросов властей юрисдикций VPN-серверов. Все данные защищены шифрованием с&nbsp;ключом, разделенным между
            командой посуточно побригадно, таким образом, что расшифровать ключ можно только при согласии большинства
            держателей ключа и&nbsp;расшифровываться будет ровно&nbsp;то, что запросят.
          </p>
        </div>
        <div v-show="showTab === 4" class="profile__tab" data-tab="4">
          <ShowMoreList/>
        </div>
      </div>
    </div>
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
    <DialogConstruction
      v-if="showDialogConstruction"
      :message="messageConstruction"
      :till="tillConstruction"
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
    :elementStepFive="secondUserProfileCard"
    :elementStepSix="searchButton"
    :elementStepThree="buttonAddUser"
    :elementStepTwo="firstUserProfileCard"
    @darkenElement="darkenElement"
    @getUsers="getUsers()"
    @highlightElement="highlightElement"
    @toggleDisable="toggleDisableAll"
  />
</template>

<script setup>
import {computed, inject, onMounted, onUnmounted, ref} from "vue";
import axios from 'axios';
import ProfileCard from './ProfileCard.vue';
import ChartLine from './ChartLine.vue';
import SvgIcon from './SvgIcon.vue';
import DialogUser from './DialogUser.vue';
import DialogOs from './DialogOs.vue';
import DialogQrCode from './DialogQrCode.vue';
import DialogConstruction from './DialogConstruction.vue';
import DialogConfig from './DialogConfig.vue';
import WelcomePage from "@/components/WelcomePage.vue";
import ShowMoreList from "@/components/ShowMoreList.vue";
import {mockedDataProfile, profileDirectionsCards, sortingMap, statusMap} from '@/assets/constants/profileConstants.js'
import {generateHighlightedElementProperties} from "@/assets/helpers/profileHelpers";
import PopupError from "@/components/PopupError.vue";
import FiltersPanel from "@/components/FiltersPanel.vue";
import useClickOutside from '@/assets/hooks/useClickOutside.js';
import Swiper from 'swiper';
import 'swiper/css';
import DialogOther from "@/components/DialogOther.vue";
import data from "../assets/helpers/data.ts";
import {useUsersStore} from "@/store/users";
import {storeToRefs} from "pinia";
import {useProfileStore} from "@/store/profile";
import {apiLink} from "@/const/api";
import DialogSelectConfig from "@/components/DialogSelectConfig.vue";
import DialogVipConfig from './DialogVipConfig.vue';


const profileStore = useProfileStore();
const usersStore = useUsersStore();
const {usersList, vipUsersList} = storeToRefs(usersStore);
const {isVIP, urlVIP, uuid} = storeToRefs(profileStore);

const buttonAddUser = ref(null);
const firstUserProfileCard = ref(null);
const secondUserProfileCard = ref(null);
const searchButton = ref(null);
const filterUserText = ref('');
const token = ref(null);
const titleDialogQrCode = ref('');
const userData = ref({});
const isError = ref(false);
const selectedFilterSort = ref(sortingMap.dateAsc);
const selectedFilterStatus = ref(statusMap.all);
const statusList = ref();
const chartList = ref(false);
const chartSelect = ref(1);
const chartSelectShow = ref(false);
const messageClose = ref(false);
const showTab = ref(1);
const loadingService = inject('loadingService');
const chartOptionsRef = ref(null);
const chartScroll = ref();
const showDialogOs = ref(false);
const showDialogOther = ref(false);
const showDialogQrCode = ref(false);
const showDialogConstruction = ref(false);
const tillConstruction = ref('');
const messageConstruction = ref('');
const showDialogConfig = ref(false);
const showDialogSelectConfig = ref(false);
const chosenOS = ref(null);
const chosenClient = ref(null);
const showDialogVipConfig = ref(false);

const vipInterval = ref(null);

onMounted(() => {
  if (window.screen.width <= 1023) {
    initSwiperData();
    window.addEventListener('resize', initSwiperData);

    chartScroll.value.scrollLeft += 1000;
  }

  if (window.screen.width <= 767) {
    initSwiperDirections();
    window.addEventListener('resize', initSwiperDirections);

    chartScroll.value.scrollLeft += 1000;
  }
})

const initSwiperData = () => {
  new Swiper('.profile__data', {
    slidesPerView: "auto",
    spaceBetween: 0,
    loop: false,
    allowTouchMove: window.screen.width <= 1023,
  });
}

const initSwiperDirections = () => {
  new Swiper('.profile__directions-cards', {
    slidesPerView: "auto",
    spaceBetween: 0,
    loop: false,
    allowTouchMove: window.screen.width <= 767,
  });
}

useClickOutside(chartOptionsRef, () => {
  chartSelectShow.value = false;
});
const chartSelected = (value) => {
  chartSelect.value = value;
  chartSelectShow.value = false;
};

const handle503 = (error) => {
  if (error.response.status === 503) {
    const till = new Date(error.response.data.till);
    const tillDate = till.toLocaleDateString('ru');
    const tillHours = till.getHours();
    const tillMinutes = till.getMinutes();
    tillConstruction.value = `${tillDate} ${tillHours}:${tillMinutes}`
    messageConstruction.value = error.response.data.message
    showDialogConstruction.value = true;
    return true
  }
  return false
}

const highlightedElementProperties = ref(generateHighlightedElementProperties(buttonAddUser, firstUserProfileCard, secondUserProfileCard, searchButton));

const selectClass = 'is-select';

const isInstructionHidden = ref(true);
const getUsers = async () => {
  usersList.value = await axios.get(`${apiLink}/user`)
    .then((r) => r.data)
    .catch(async (error) => {
      if (handle503(error)) return;
      if (error.response.status === 401) {
        await getToken();
        getUsers();
      } else {
        isError.value = true;
        console.error(error);
      }
    });
  if (isVIP.value && urlVIP.value) {
    await getVipUsers();
  }
  if (localStorage.getItem('isInstructionHidden')) {
    statusList.value = new Set(usersList.value?.map(user => user.Status))
  }
};

const getVipUsers = async () => {
  await axios.post('https://' + urlVIP.value).then((r) => {
    if (r.data?.data) {
      vipUsersList.value = r.data.data;
    }
  })
}

const getChart = async () => {
  chartList.value = await axios.get(`${apiLink}/users/stats`)
    .then((r) => r.data)
    .catch(async (error) => {
      if (handle503(error)) return;
      if (error.response.status === 401) {
        await getToken();
        getChart();
      } else {
        isError.value = true;
        console.error(error);
      }
    }).finally(() => {
      loadingService.hide();
    });
};

const iconActiveUsers = computed(() => {
  return chartList.value && chartList.value.ActiveUsers[11].Value > chartList.value.ActiveUsers[10].Value ?
    "icon-stats-up" :
    chartList.value.ActiveUsers[11].Value < chartList.value.ActiveUsers[10].Value ?
      "icon-stats-down" : '';
});

const iconTotalUsers = computed(() => {
  return chartList.value && chartList.value.TotalUsers[11].Value > chartList.value.TotalUsers[10].Value ?
    "icon-stats-up" :
    chartList.value.TotalUsers[11].Value < chartList.value.TotalUsers[10].Value ?
      "icon-stats-down" : '';
});

const iconTotalTraffic = computed(() => {
  return chartList.value && chartList.value.TotalTrafficGB[11].Value > chartList.value.TotalTrafficGB[10].Value ?
    "icon-stats-up" :
    chartList.value.TotalTrafficGB[11].Value < chartList.value.TotalTrafficGB[10].Value ?
      "icon-stats-down" : '';
});

const messageShow = computed(() => {
  return !messageClose.value && chartList.value && chartList.value.ActiveUsers[11].Value < 5;
});

const getRefForHighlight = (index) => {
  return index === 0 ? 'firstUserProfileCard' : 'secondUserProfileCard'
}

const getToken = async () => {
  loadingService.show();
  await axios.post(`${apiLink}/token`).then((r) => {
    token.value = r.data.Token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;

    getChart();

    if (isVIP.value) {
      isInstructionHidden.value = true;
    } else {
      isInstructionHidden.value = localStorage.getItem('isInstructionHidden');
    }

    if (isInstructionHidden.value) {
      getUsers();
    } else {
      usersList.value = mockedDataProfile;
    }
  }).catch(async error => {
    handle503(error);
  }).finally(() => {
    loadingService.hide();
  });
}

getToken();

const addUser = async () => {
  loadingService.show();
  await axios.post(`${apiLink}/user`, {}, {
    responseType: 'application/json',
    headers: {
      'accept': 'application/json'
    }
  }).then((r) => {
    userData.value = JSON.parse(r.data);
    getUsers();
  }).catch(async (error) => {
    if (handle503(error)) return;
    if (error.response.status === 401) {
      await getToken();
      addUser();
    } else {
      isError.value = true;
      console.error(error);
    }
  }).finally(() => {
    loadingService.hide();
  });
};

const removeUser = async (id) => {
  loadingService.show();
  await axios.delete(`${apiLink}/user/${id}`)
    .then(() => {
      showDialogUser.value = false;
      deletedUserId.value = null;
      getUsers()
    }).catch(async (error) => {
      if (handle503(error)) return;
      if (error.response.status === 401) {
        await getToken()
        removeUser(deletedUserId.value)
      } else {
        isError.value = true;
        console.error(error)
      }
    }).finally(() => {
      loadingService.hide();
    });
}

const addUserHandler = async () => {
  isVIP.value ? showDialogSelectConfig.value = true : await handleConfigSelect('linux');
}

const handleConfigSelect = async (configType) => {
  closeDialogSelectConfig();

  if (configType === 'vip') return window.open(`https://t.me/vipgenbot?start=${uuid.value}`, '_blank');

  await addUser();
  openDialogQrCodeHandler('linux');
}

const closeDialogSelectConfig = () => {
  showDialogSelectConfig.value = false;
}

const filteredUsers = computed(() => {
  let filter = filterUserText.value

  if (usersList.value.length && localStorage.getItem('isInstructionHidden')) {
    let [firstElement, ...userListCopy] = usersList.value
    switch (selectedFilterStatus.value) {
      case statusMap.green:
        userListCopy = userListCopy.filter(user =>
          user.Status.toLowerCase().includes(statusMap.green)
        );
        break;
      case statusMap.black:
        userListCopy = userListCopy.filter(user =>
          user.Status.toLowerCase().includes(statusMap.black)
        );
        break;
      case statusMap.grey:
        userListCopy = userListCopy.filter(user =>
          user.Status.toLowerCase().includes(statusMap.grey)
        );
        break;
      case statusMap.yellow:
        userListCopy = userListCopy.filter(user =>
          user.Status.toLowerCase().includes(statusMap.yellow)
        );
        break;
      case statusMap.red:
        userListCopy = userListCopy.filter(user =>
          user.Status.toLowerCase().includes(statusMap.red)
        )
        break;
    }

    switch (selectedFilterSort.value) {
      case sortingMap.nameAsc:
        userListCopy = userListCopy.sort((a, b) => a.UserName.localeCompare(b.UserName));
        break;
      case sortingMap.nameDesc:
        userListCopy = userListCopy.sort((a, b) => b.UserName.localeCompare(a.UserName));
        break;
      case sortingMap.dateAsc:
        userListCopy = userListCopy.sort((a, b) => a?.CreatedAt.localeCompare(b?.CreatedAt));
        break;
      case sortingMap.dateDesc:
        userListCopy = userListCopy.sort((a, b) => b?.CreatedAt.localeCompare(a?.CreatedAt));
        break;
    }

    userListCopy = userListCopy.filter(user =>
      user.UserName.toLowerCase().includes(filter.toLowerCase())
    );

    return [firstElement, ...userListCopy]
  }
  return usersList.value;
})

const showDialogUser = ref(false);
const deletedUserId = ref(null);

const closeDialogUser = () => {
  showDialogUser.value = false;
};

const returnToOthersHandler = () => {
  showDialogQrCode.value = !showDialogQrCode.value;
  showDialogOther.value = true;
}

const toggleDialogOtherHandler = () => {
  showDialogOther.value = !showDialogOther.value;
};

const openDialogUser = (id) => {
  deletedUserId.value = id;
  showDialogUser.value = true
};

const openViewKey = (vipUserIndex) => {
  const vipUser = vipUsersList.value[vipUserIndex];
  console.log(vipUser);
  userData.value = {
    title: `VIP-ключ #${vipUserIndex + 1}`,
    vipConfig: vipUser.good_content,
    userId: vipUser.user_id
  };
  showDialogVipConfig.value = true;
}

const closeDialogVipConfig = () => {
  showDialogVipConfig.value = false;
}

const toggleDialogOsHandler = () => {
  showDialogOther.value = false;
  showDialogOs.value = !showDialogOs.value;
};

const closeDialogQrCodeHandler = () => {
  showDialogQrCode.value = !showDialogQrCode.value;
};

const configName = ref('');

const openDialogQrCodeHandler = (type) => {
  const osType = typeof type === 'string' ? type : type.value;
  chosenOS.value = osType;
  const configList = require('../../vpn_sistems_config.json');
  const configType = configList.system_defaults[osType];
  configName.value = configType;
  if (osType === 'other') {
    showDialogOs.value = !showDialogOs.value;
    showDialogOther.value = !showDialogOther.value;
  } else {
    titleDialogQrCode.value = osType;
    showDialogOther.value = false;
    showDialogQrCode.value = !showDialogQrCode.value;
  }
};

const togleDialogConfigHandler = () => {
  showDialogConfig.value = !showDialogConfig.value;
};

const switchDialogConfigHandler = (configType) => {
  toggleDialogOtherHandler()
  togleDialogConfigHandler();
  if (configType) {
    chosenClient.value = configType.value;
  }
}

const skipDialogConfig = () => {
  showDialogOs.value = !showDialogOs.value;
  toggleDialogOtherHandler()
};

const highlightElement = (path) => {
  highlightedElementProperties.value[path].highlight = 'highlight';
}

const darkenElement = (path) => {
  highlightedElementProperties.value[path].highlight = '';
}

const toggleDisableAll = () => {
  for (let key in highlightedElementProperties.value) {
    if (highlightedElementProperties.value[key].hasOwnProperty("disabled")) {
      highlightedElementProperties.value[key].disabled = !highlightedElementProperties.value[key].disabled;
    }
  }
}

onMounted(() => {
  if (isVIP.value) {
    vipInterval.value = setInterval(() => getVipUsers(), 10000);
  }
});


onUnmounted(() => {
  if (vipInterval.value) {
    clearInterval(vipInterval.value);
  }
})
</script>
