<template>
  <div class="pro-page">
    <RouterLink :to="{path: '/', query: route.query}" class="pro-page__back">
      ← {{ t('pro.nav.backToKeys') }}
    </RouterLink>

    <div class="pro-page__header">
      <div class="pro-page__header-main">
        <div class="pro-page__eyebrow">
          <template v-if="brigadeName">{{ t('pro.analytics.subtitleNamed', {name: brigadeName}) }}</template>
          <template v-else>{{ t('pro.analytics.subtitle') }}</template>
        </div>
        <h1 class="pro-page__title">{{ t('pro.analytics.title') }}</h1>
      </div>
      <div class="pro-analytics__report-stamp">
        {{ t('pro.analytics.report') }}<br><span class="pro-analytics__report-month">{{ reportMonth }}</span>
      </div>
    </div>

    <ProStatCards :stats="statCards"/>

    <div class="pro-analytics__panels">
      <ProRevenueChart :bars="chartBars"/>
      <ProMrrPanel :points="mrrPoints" :rows="growthRows"/>
    </div>

    <ProAdviceCards :cards="adviceCards" @action="onAdvice"/>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {RouterLink, useRoute, useRouter} from 'vue-router';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import ProStatCards from '@/components/pro/analytics/ProStatCards.vue';
import ProRevenueChart from '@/components/pro/analytics/ProRevenueChart.vue';
import ProMrrPanel from '@/components/pro/analytics/ProMrrPanel.vue';
import ProAdviceCards from '@/components/pro/analytics/ProAdviceCards.vue';
import {useProKeysStore} from '@/store/proKeys';
import {useProKeysFilterStore} from '@/store/proKeysFilter';
import {useProfileStore} from '@/store/profile';
import {REVENUE_HISTORY, ALL_TIME_EXTRA} from '@/api/proMockData';
import {tierPrice, isInactive30, usedGb} from '@/utils/proKeys';
import {INACTIVE_DAYS} from '@/assets/constants/proConstants';
import {money, monthShift, daysSinceVisit, today} from '@/utils/proFormat';

const {t, tm} = useI18n();
const route = useRoute();
const router = useRouter();
const proKeysStore = useProKeysStore();
const filterStore = useProKeysFilterStore();
const {keysList, brigadeName} = storeToRefs(proKeysStore);
const {isPRO} = storeToRefs(useProfileStore());
// Реальная PRO-бригада: истории выручки на бэкенде нет, поэтому прошлые месяцы
// показываем без значений, а не цифрами из макета. Фикстура - только для мок-стенда.
const isReal = computed(() => isPRO.value === true);

const monthsShort = computed(() => tm('pro.months.short'));
const monthsFull = computed(() => tm('pro.months.full'));

const reportMonth = computed(() => `${monthsFull.value[today().getMonth()]} ${today().getFullYear()}`);

const liveKeys = computed(() => keysList.value.filter((k) => !k.off));
const revenue = computed(() => liveKeys.value.reduce((sum, k) => sum + (k.sold || 0), 0));
const cost = computed(() => liveKeys.value.reduce((sum, k) => sum + tierPrice(k.tier), 0));
const profitMonth = computed(() => revenue.value - cost.value);
const mrr = computed(() => liveKeys.value.reduce((sum, k) => sum + (k.tier === 'free' ? 0 : (k.sold || 0)), 0));

const history = computed(() => {
  const past = isReal.value ? REVENUE_HISTORY.map(() => null) : REVENUE_HISTORY;
  const values = [...past, revenue.value];
  return values.map((value, i) => ({
    label: monthsShort.value[monthShift(i - 5).getMonth()],
    value,
  }));
});

const chartBars = computed(() => {
  const maxRev = history.value.reduce((max, h) => Math.max(max, h.value || 0), 1);
  return history.value.map((h, i) => ({
    label: h.label,
    value: h.value === null ? '—' : `€${h.value}`,
    height: `${Math.max(6, Math.round((h.value || 0) / maxRev * 150))}px`,
    isLast: i === history.value.length - 1,
  }));
});

const allTime = computed(() => history.value.reduce((sum, h) => sum + (h.value || 0), 0) + (isReal.value ? 0 : ALL_TIME_EXTRA));

const mrrPoints = computed(() => {
  const factors = isReal.value ? [1, 1, 1, 1, 1, 1] : [0.55, 0.65, 0.75, 0.84, 0.92, 1];
  const hist = factors.map((f) => Math.round(mrr.value * f));
  const maxMrr = hist.reduce((max, v) => Math.max(max, v), 1);
  return hist
    .map((v, i) => `${Math.round(i * (320 / (hist.length - 1)))},${Math.round(115 - v / maxMrr * 100)}`)
    .join(' ');
});

// «Нет подключений 30+ дней» - только ранее использованные ключи; экономия -
// цена только платных из них (Free ничего не стоит).
const inactiveKeys = computed(() => liveKeys.value.filter(isInactive30));
const inactive = computed(() => inactiveKeys.value.length);
const inactiveSavings = computed(() => inactiveKeys.value.reduce((sum, k) => sum + tierPrice(k.tier), 0));
// Апгрейд советуем по измеренному расходу (>50 ГБ), а не по лимиту тарифа;
// без данных о расходе ключ в выборку не попадает.
const topActiveKeys = computed(() => liveKeys.value.filter((k) => k.tier === 'basic' && (usedGb(k) ?? 0) > 50));
const topActive = computed(() => topActiveKeys.value.length);
const upgradeExtraCost = computed(() => topActive.value * (tierPrice('unlim') - tierPrice('basic')));
// Новые за 30 дней - по дате создания ключа (реальный keydesk отдаёт CreatedAt).
const joinedKeys = computed(() => liveKeys.value.filter((k) => k.createdAt && daysSinceVisit(k.createdAt) < INACTIVE_DAYS));
const joined = computed(() => joinedKeys.value.length);
const left = computed(() => keysList.value.filter((k) => k.off).length);
const retained = computed(() => liveKeys.value.filter((k) => k.lastVisit && daysSinceVisit(k.lastVisit) < 30).length);
const paying = computed(() => liveKeys.value.filter((k) => k.tier !== 'free' && k.sold > 0).length);
const net = computed(() => joined.value - left.value);

const statCards = computed(() => [
  {
    label: t('pro.analytics.statRevMonth', {month: monthsFull.value[today().getMonth()]}),
    value: money(revenue.value),
    hint: t('pro.analytics.statRevMonthHint', {count: liveKeys.value.filter((k) => k.sold).length}),
    tone: 'ink',
  },
  {
    label: t('pro.analytics.statRevAll'),
    value: money(allTime.value),
    hint: isReal.value ? t('pro.analytics.statRevAllHintReal') : t('pro.analytics.statRevAllHint'),
    tone: 'ink',
  },
  {
    label: t('pro.analytics.statMrr'),
    value: money(mrr.value),
    hint: t('pro.analytics.statMrrHint', {cost: money(cost.value)}),
    tone: 'blue',
  },
  {
    label: t('pro.analytics.statProfit'),
    value: `${profitMonth.value > 0 ? '+' : ''}${money(profitMonth.value)}`,
    hint: t('pro.analytics.statProfitHint'),
    tone: profitMonth.value > 0 ? 'green' : 'red',
    raised: true,
  },
]);

const growthRows = computed(() => [
  {label: t('pro.analytics.growth.mrr'), value: money(mrr.value), tone: 'blue', tip: t('pro.analytics.growth.tipMrr')},
  {label: t('pro.analytics.growth.paying'), value: String(paying.value), tone: 'ink'},
  {label: t('pro.analytics.growth.joined'), value: `+${joined.value}`, tone: 'green'},
  {label: t('pro.analytics.growth.left'), value: `−${left.value}`, tone: 'red'},
  {label: t('pro.analytics.growth.net'), value: `${net.value >= 0 ? '+' : ''}${net.value}`, tone: 'ink'},
  {label: t('pro.analytics.growth.retention'), value: t('pro.analytics.growth.retentionValue', {kept: retained.value, total: liveKeys.value.length}), tone: 'green', tip: t('pro.analytics.growth.tipRetention')},
]);

// Рекомендации без данных (0 ключей) не показываем.
const allAdviceCards = computed(() => [
  {
    id: 'inactive',
    hidden: inactive.value === 0,
    n: String(inactive.value),
    tone: 'amber',
    title: t('pro.analytics.advice.inactive.title'),
    body: t('pro.analytics.advice.inactive.body'),
    cta: t('pro.analytics.advice.inactive.cta'),
    foot: t('pro.analytics.advice.inactive.foot', {sum: money(inactiveSavings.value)}),
  },
  {
    id: 'topActive',
    hidden: topActive.value === 0,
    n: String(topActive.value),
    tone: 'blue',
    title: t('pro.analytics.advice.topActive.title'),
    body: t('pro.analytics.advice.topActive.body'),
    cta: t('pro.analytics.advice.topActive.cta'),
    foot: t('pro.analytics.advice.topActive.foot', {amount: money(upgradeExtraCost.value)}),
  },
  {
    id: 'joined',
    n: `+${joined.value}`,
    tone: 'green',
    title: t('pro.analytics.advice.newUsers.title'),
    body: t('pro.analytics.advice.newUsers.body', {people: t('pro.plurals.people', joined.value)}),
    cta: t('pro.analytics.advice.newUsers.cta'),
    foot: t('pro.analytics.advice.newUsers.foot'),
  },
  {
    id: 'net',
    n: `${net.value >= 0 ? '+' : ''}${net.value}`,
    tone: 'ink',
    title: t('pro.analytics.advice.netGrowth.title'),
    body: t('pro.analytics.advice.netGrowth.body', {joined: joined.value, left: left.value}),
    cta: t('pro.analytics.advice.netGrowth.cta'),
    foot: t('pro.analytics.advice.netGrowth.foot'),
  },
]);

const adviceCards = computed(() => allAdviceCards.value.filter((card) => card.hidden !== true));

const onAdvice = (id) => {
  if (id === 'inactive') {
    filterStore.applyPreset({status: 'inactive', viewMode: 'table'});
    router.push({path: '/', query: route.query});
    return;
  }
  if (id === 'topActive') {
    // Та же выборка, что в рекомендации, - не просто «Basic по трафику».
    filterStore.applyPreset({tier: 'basic', sort: 'traffic', viewMode: 'table', ids: topActiveKeys.value.map((k) => k.id)});
    router.push({path: '/', query: route.query});
    return;
  }
  if (id === 'joined') {
    filterStore.applyPreset({sort: 'last', viewMode: 'cards', ids: joinedKeys.value.map((k) => k.id)});
    router.push({path: '/', query: route.query});
    return;
  }
  router.push({path: '/invoices', query: route.query});
};
</script>
