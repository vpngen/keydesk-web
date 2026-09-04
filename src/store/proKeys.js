import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import * as proApi from '@/api/pro';
import {paidKeys, forecast} from '@/utils/proKeys';
import {addMonths} from '@/utils/proFormat';

export const useProKeysStore = defineStore('proKeys', () => {
  const keysList = ref([]);
  const brigadierName = ref('');
  const brigadeName = ref('');
  const isLoaded = ref(false);
  // Выбор протокола/формата на карточке живет здесь, чтобы переживать
  // переключение карточки⇄таблица (как в макете).
  const protoByKey = ref({});
  const formatByKey = ref({});
  let nextNum = 40;

  const paidList = computed(() => paidKeys(keysList.value));
  const forecastSum = computed(() => forecast(keysList.value));
  const freeCount = computed(() => keysList.value.filter((k) => k.tier === 'free').length);

  const mergeKey = (id, fields) => {
    keysList.value = keysList.value.map((k) => (k.id === id ? {...k, ...fields} : k));
  };

  const fetchKeys = async () => {
    const data = await proApi.fetchProKeys();
    keysList.value = data.keys;
    brigadierName.value = data.brigadierName || '';
    brigadeName.value = data.brigadeName || '';
    isLoaded.value = true;
    nextNum = keysList.value.reduce((m, k) => Math.max(m, k.num + 1), nextNum);
  };

  const createKey = async (payload) => {
    const num = nextNum;
    nextNum += 1;
    const localKey = {
      id: `local-${num}`,
      num,
      user: `user-0${num}`,
      name: payload.name,
      note: payload.note,
      tier: payload.tier,
      proto: payload.proto,
      sold: payload.sold,
      off: false,
      lastVisit: null,
      gb: 0,
      until: payload.tier === 'free' ? null : addMonths(null, payload.months),
    };
    const key = await proApi.createProKey(payload, localKey) || localKey;
    keysList.value = keysList.value.concat([key]);
    return key;
  };

  /** Название / комментарий / «продал за». */
  const patchKeyMeta = async (id, fields) => {
    await proApi.patchProKeyMeta(id, fields);
    mergeKey(id, fields);
  };

  // Ключ, заблокированный из-за истёкшего срока, бэкенд разблокирует при
  // продлении/смене тарифа — отражаем это и в локальном состоянии.
  const reviveFields = (id) => {
    const current = keysList.value.find((k) => k.id === id);
    return current?.blockReason === 'expired' ? {blockReason: null, off: false} : {};
  };

  /** Смена тарифа; возвращает новую дату окончания. */
  const setKeyTier = async (id, tier, months) => {
    const revive = reviveFields(id);
    const until = await proApi.setProKeyTier(id, tier, months);
    mergeKey(id, {tier, until, ...(until ? revive : {})});
    return until;
  };

  /** Продление платного ключа; возвращает новую дату окончания. */
  const extendKey = async (id, months) => {
    const current = keysList.value.find((k) => k.id === id);
    const revive = reviveFields(id);
    const until = await proApi.extendProKey(id, months, current?.until || null);
    mergeKey(id, {until, ...(until ? revive : {})});
    return until;
  };

  /** Деактивация/включение. */
  const setKeyOff = async (id, off) => {
    await proApi.setProKeyOff(id, off);
    mergeKey(id, off ? {off: true} : {off: false, lastVisit: new Date().toISOString()});
  };

  const removeKey = async (id) => {
    await proApi.deleteProKey(id);
    keysList.value = keysList.value.filter((k) => k.id !== id);
  };

  const setKeyProto = (id, proto) => {
    protoByKey.value = {...protoByKey.value, [id]: proto};
  };

  const setKeyFormat = (id, format) => {
    formatByKey.value = {...formatByKey.value, [id]: format};
  };

  return {
    keysList,
    brigadierName,
    brigadeName,
    isLoaded,
    protoByKey,
    formatByKey,
    paidList,
    forecastSum,
    freeCount,
    fetchKeys,
    createKey,
    patchKeyMeta,
    setKeyTier,
    extendKey,
    setKeyOff,
    removeKey,
    setKeyProto,
    setKeyFormat,
  };
});
