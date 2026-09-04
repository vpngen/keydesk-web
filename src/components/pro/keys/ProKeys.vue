<template>
  <div class="pro-keys">
    <div class="pro-keys__greeting">
      <h1 class="pro-keys__headline">{{ t('pro.header.greeting', {name: brigadierName || t('pro.header.brigadier')}) }}</h1>
      <div class="pro-keys__subline">
        <template v-if="brigadeName">{{ t('pro.header.brigade', {name: brigadeName}) }} · </template>{{ t('pro.plurals.keys', keysList.length) }}
      </div>
    </div>

    <ProBillingBanner @pay="openPay"/>

    <ProKeysToolbar @create="openCreate"/>

    <ProKeyCardsList
      v-if="view === 'cards' && filteredKeys.length"
      :keys="filteredKeys"
      :open-menu-id="openMenuId"
      @copy="copyKey"
      @open-confirm="openConfirm"
      @open-extend="openExtend"
      @open-name="openName"
      @open-note="openNote"
      @open-pay="openPay"
      @open-sold="openSold"
      @open-upgrade="openUpgrade"
      @restore="restoreKey"
      @toggle-menu="toggleMenu"
    />

    <ProKeysTable
      v-if="view === 'table' && filteredKeys.length"
      :keys="filteredKeys"
      :open-menu-id="openMenuId"
      @copy="copyKey"
      @open-confirm="openConfirm"
      @open-extend="openExtend"
      @open-name="openName"
      @open-note="openNote"
      @open-pay="openPay"
      @open-sold="openSold"
      @open-upgrade="openUpgrade"
      @restore="restoreKey"
      @toggle-menu="toggleMenu"
    />

    <ProKeysEmpty
      v-if="isLoaded && !filteredKeys.length"
      :has-keys="keysList.length > 0"
      :has-search="Boolean(filterText.trim())"
      :paid-filter="selectedTier !== 'all' && selectedTier !== 'free'"
      @clear-filters="clearFilters"
      @clear-search="filterStore.filterText = ''"
      @create="openCreate"
    />

    <ProPhotoStrip/>

    <div v-if="filteredKeys.length" class="pro-keys__footer">
      <div>{{ countsLine }}</div>
      <div>VPN Generator · {{ new Date().getFullYear() }}</div>
    </div>
  </div>

  <teleport to="#app">
    <ProDialogCreateKey
      v-if="showDialogCreate"
      :created-key="createdKey"
      :forecast-sum="forecastSum"
      @close="closeCreate"
      @create="createKey"
    />
    <ProDialogUpgrade
      v-if="showDialogUpgrade && dialogKey"
      :forecast-sum="forecastSum"
      :key-item="dialogKey"
      @close="showDialogUpgrade = false"
      @upgrade="upgradeKey"
    />
    <ProDialogExtend
      v-if="showDialogExtend && dialogKey"
      :forecast-sum="forecastSum"
      :key-item="dialogKey"
      @close="showDialogExtend = false"
      @extend="extendKey"
    />
    <ProDialogName
      v-if="showDialogName && dialogKey"
      :key-item="dialogKey"
      @close="showDialogName = false"
      @save="saveName"
    />
    <ProDialogNote
      v-if="showDialogNote && dialogKey"
      :key-item="dialogKey"
      @close="showDialogNote = false"
      @save="saveNote"
    />
    <ProDialogSold
      v-if="showDialogSold && dialogKey"
      :key-item="dialogKey"
      @close="showDialogSold = false"
      @save="saveSold"
    />
    <ProDialogConfirm
      v-if="showDialogConfirm && dialogKey"
      :forecast-sum="forecastSum"
      :key-item="dialogKey"
      :kind="confirmKind"
      @close="showDialogConfirm = false"
      @confirm="confirmAction"
    />
    <ProDialogPay
      v-if="showDialogPay"
      @close="showDialogPay = false"
      @pay="payInvoice"
    />
  </teleport>
</template>

<script setup>
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import ProBillingBanner from '@/components/pro/keys/ProBillingBanner.vue';
import ProKeysToolbar from '@/components/pro/keys/ProKeysToolbar.vue';
import ProKeyCardsList from '@/components/pro/keys/ProKeyCardsList.vue';
import ProKeysTable from '@/components/pro/keys/ProKeysTable.vue';
import ProKeysEmpty from '@/components/pro/keys/ProKeysEmpty.vue';
import ProPhotoStrip from '@/components/pro/keys/ProPhotoStrip.vue';
import ProDialogCreateKey from '@/components/pro/dialogs/ProDialogCreateKey.vue';
import ProDialogUpgrade from '@/components/pro/dialogs/ProDialogUpgrade.vue';
import ProDialogExtend from '@/components/pro/dialogs/ProDialogExtend.vue';
import ProDialogName from '@/components/pro/dialogs/ProDialogName.vue';
import ProDialogNote from '@/components/pro/dialogs/ProDialogNote.vue';
import ProDialogSold from '@/components/pro/dialogs/ProDialogSold.vue';
import ProDialogConfirm from '@/components/pro/dialogs/ProDialogConfirm.vue';
import ProDialogPay from '@/components/pro/dialogs/ProDialogPay.vue';
import {useProKeysStore} from '@/store/proKeys';
import {useProKeysFilterStore} from '@/store/proKeysFilter';
import {useProBillingStore} from '@/store/proBilling';
import {useProToastStore} from '@/store/proToast';
import {statusOf, profitOf, accessString, availableProtos, defaultFormat} from '@/utils/proKeys';
import {formatIso, parseIso, daysSinceVisit} from '@/utils/proFormat';

const {t} = useI18n();
const proKeysStore = useProKeysStore();
const filterStore = useProKeysFilterStore();
const billingStore = useProBillingStore();
const toastStore = useProToastStore();

const {keysList, brigadierName, brigadeName, isLoaded, forecastSum, freeCount, protoByKey, formatByKey} = storeToRefs(proKeysStore);
const {filterText, selectedTier, selectedStatus, selectedSort, view} = storeToRefs(filterStore);
const {status: billingStatus} = storeToRefs(billingStore);

const openMenuId = ref(null);
const dialogKey = ref(null);
const confirmKind = ref('off');
const createdKey = ref(null);

const showDialogCreate = ref(false);
const showDialogUpgrade = ref(false);
const showDialogExtend = ref(false);
const showDialogName = ref(false);
const showDialogNote = ref(false);
const showDialogSold = ref(false);
const showDialogConfirm = ref(false);
const showDialogPay = ref(false);

const filteredKeys = computed(() => {
  const q = filterText.value.trim().toLowerCase();
  const list = keysList.value.filter((k) => {
    if (q
      && !(k.name || '').toLowerCase().includes(q)
      && !(k.note || '').toLowerCase().includes(q)
      && !k.user.includes(q)) return false;
    if (selectedTier.value !== 'all' && k.tier !== selectedTier.value) return false;
    if (selectedStatus.value !== 'all' && statusOf(k, billingStatus.value) !== selectedStatus.value) return false;
    return true;
  });

  return [...list].sort((a, b) => {
    if (selectedSort.value === 'name') return (a.name || '￿').localeCompare(b.name || '￿');
    if (selectedSort.value === 'traffic') return b.gb - a.gb;
    if (selectedSort.value === 'profit') return profitOf(b) - profitOf(a);
    if (selectedSort.value === 'last') return daysSinceVisit(a.lastVisit) - daysSinceVisit(b.lastVisit);
    const ax = a.until ? parseIso(a.until).getTime() : 9e15;
    const bx = b.until ? parseIso(b.until).getTime() : 9e15;
    return ax - bx;
  });
});

const countsLine = computed(() => t('pro.table.countsLine', {
  shown: filteredKeys.value.length,
  total: keysList.value.length,
  free: freeCount.value,
  pro: keysList.value.length - freeCount.value,
}));

const toggleMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

const withKey = (show) => (key) => {
  dialogKey.value = key;
  openMenuId.value = null;
  show.value = true;
};

const openSold = withKey(showDialogSold);
const openName = withKey(showDialogName);
const openNote = withKey(showDialogNote);
const openExtend = withKey(showDialogExtend);
const openUpgrade = withKey(showDialogUpgrade);

const openConfirm = (key, kind) => {
  dialogKey.value = key;
  confirmKind.value = kind;
  openMenuId.value = null;
  showDialogConfirm.value = true;
};

const openPay = () => {
  openMenuId.value = null;
  showDialogPay.value = true;
};

const openCreate = () => {
  createdKey.value = null;
  openMenuId.value = null;
  showDialogCreate.value = true;
};

const closeCreate = () => {
  showDialogCreate.value = false;
  createdKey.value = null;
};

const clearFilters = () => {
  filterStore.reset();
};

const copyKey = async (key) => {
  const status = statusOf(key, billingStatus.value);
  if (status === 'blocked') {
    toastStore.show(t('pro.toasts.copyBlocked'));
    return;
  }
  const protos = availableProtos(key);
  let proto = protoByKey.value[key.id] || key.proto;
  if (protos && !protos.includes(proto)) [proto] = protos;
  const format = formatByKey.value[key.id] || defaultFormat(key);
  const value = accessString(key, proto, format);
  if (!value) {
    toastStore.show(t('pro.toasts.noStoredKey'));
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    /* клипборд недоступен (http/permissions) — тост все равно показываем */
  }
  const protoName = t(`pro.protocols.${proto}`);
  toastStore.show(format === 'key'
    ? t('pro.toasts.copiedKey', {proto: protoName, user: key.user})
    : t('pro.toasts.copiedLink', {proto: protoName, user: key.user}));
};

const restoreKey = async (key) => {
  await proKeysStore.setKeyOff(key.id, false);
  toastStore.show(t('pro.toasts.restored', {user: key.user}));
};

const createKey = async (payload) => {
  createdKey.value = await proKeysStore.createKey(payload);
  toastStore.show(t('pro.toasts.created'));
};

const upgradeKey = async ({tier, months}) => {
  await proKeysStore.setKeyTier(dialogKey.value.id, tier, months);
  toastStore.show(t('pro.toasts.upgraded', {tier: t(`pro.tiers.${tier}.name`)}));
};

const extendKey = async ({months}) => {
  const until = await proKeysStore.extendKey(dialogKey.value.id, months);
  showDialogExtend.value = false;
  toastStore.show(t('pro.toasts.extended', {date: formatIso(until)}));
};

const saveName = async (text) => {
  await proKeysStore.patchKeyMeta(dialogKey.value.id, {name: text});
  showDialogName.value = false;
  toastStore.show(text ? t('pro.toasts.nameSaved') : t('pro.toasts.nameCleared'));
};

const saveNote = async (text) => {
  await proKeysStore.patchKeyMeta(dialogKey.value.id, {note: text});
  showDialogNote.value = false;
  toastStore.show(text ? t('pro.toasts.noteSaved') : t('pro.toasts.noteCleared'));
};

const saveSold = async (sum) => {
  await proKeysStore.patchKeyMeta(dialogKey.value.id, {sold: sum});
  showDialogSold.value = false;
  toastStore.show(sum ? t('pro.toasts.soldSaved') : t('pro.toasts.soldCleared'));
};

const confirmAction = async () => {
  if (confirmKind.value === 'del') {
    await proKeysStore.removeKey(dialogKey.value.id);
    toastStore.show(t('pro.toasts.deleted'));
  } else {
    await proKeysStore.setKeyOff(dialogKey.value.id, true);
    toastStore.show(t('pro.toasts.deactivated'));
  }
  showDialogConfirm.value = false;
};

const payInvoice = async () => {
  await billingStore.payCurrentInvoice();
  await proKeysStore.fetchKeys();
  showDialogPay.value = false;
  toastStore.show(t('pro.toasts.invoicePaid'));
};
</script>
