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

    <div v-if="failed" class="pro-analytics__note pro-analytics__note--boxed">
      <span class="pro-analytics__note-icon">!</span>
      <span>{{ t('pro.analytics.failed') }}</span>
    </div>
    <div v-else-if="!analytics" class="pro-analytics__loading">{{ t('pro.analytics.loading') }}</div>

    <template v-else>
      <!-- Расчетный период бригады: все основные показатели - за него. -->
      <div class="pro-analytics__period">
        <span class="pro-analytics__period-label">{{ t('pro.analytics.period.label') }}</span>
        <span class="pro-analytics__period-value">{{ periodText }}</span>
        <ProHint :text="t('pro.analytics.period.tip')"/>
        <span class="pro-analytics__period-note">{{ t('pro.analytics.period.tip') }}</span>
      </div>

      <ProAnalyticsEmpty v-if="noPaid" kind="noPaid" @action="goCreate"/>

      <template v-else>
        <ProStatCards :stats="statCards"/>

        <div class="pro-analytics__notes">
          <div class="pro-analytics__note pro-analytics__note--boxed">
            <span class="pro-analytics__note-icon">i</span>
            <span>{{ t('pro.analytics.disclaimer') }}</span>
          </div>
          <div v-if="partialPrices" class="pro-analytics__note pro-analytics__note--boxed pro-analytics__note--amber">
            <span class="pro-analytics__note-icon">!</span>
            <span>{{ t('pro.analytics.pricesPartial', {priced: paid.priced, active: paid.active}) }}</span>
          </div>
        </div>

        <ProAnalyticsEmpty v-if="noPrices" kind="noPrices" @action="goPrices"/>

        <div class="pro-analytics__panels">
          <ProRevenueChart :bars="chartBars"/>
          <ProPaidUsersPanel :paid="paid"/>
          <ProRenewalsPanel :period-index="analytics.period.index" :renewals="analytics.renewals"/>
        </div>

        <ProAdviceCards :cards="attentionCards" @action="onAction"/>
      </template>
    </template>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {RouterLink, useRoute, useRouter} from 'vue-router';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import ProHint from '@/components/pro/analytics/ProHint.vue';
import ProStatCards from '@/components/pro/analytics/ProStatCards.vue';
import ProRevenueChart from '@/components/pro/analytics/ProRevenueChart.vue';
import ProPaidUsersPanel from '@/components/pro/analytics/ProPaidUsersPanel.vue';
import ProRenewalsPanel from '@/components/pro/analytics/ProRenewalsPanel.vue';
import ProAdviceCards from '@/components/pro/analytics/ProAdviceCards.vue';
import ProAnalyticsEmpty from '@/components/pro/analytics/ProAnalyticsEmpty.vue';
import {useProKeysStore} from '@/store/proKeys';
import {useProKeysFilterStore} from '@/store/proKeysFilter';
import {useProfileStore} from '@/store/profile';
import * as proApi from '@/api/pro';
import {money, formatShort, today} from '@/utils/proFormat';

const {t, tm, locale} = useI18n();
const route = useRoute();
const router = useRouter();
const proKeysStore = useProKeysStore();
const filterStore = useProKeysFilterStore();
const {keysList, brigadeName, isLoaded} = storeToRefs(proKeysStore);
const {isPRO} = storeToRefs(useProfileStore());
const isReal = computed(() => isPRO.value === true);

// Все бизнес-метрики считает бэкенд (GET /pro/analytics); фронт только
// раскладывает их по блокам. Мок-стенд получает приближение по ключам.
const analytics = ref(null);
const failed = ref(false);

const load = async () => {
  failed.value = false;
  try {
    analytics.value = await proApi.fetchProAnalytics(keysList.value);
  } catch (error) {
    console.error(error);
    failed.value = true;
  }
};

onMounted(load);

// Мок-стенд: ключи могут подгрузиться позже аналитики.
watch(isLoaded, (loaded) => {
  if (loaded && !isReal.value) load();
});

const monthsShort = computed(() => tm('pro.months.short'));
const monthsFull = computed(() => tm('pro.months.full'));

const reportMonth = computed(() => `${monthsFull.value[today().getMonth()]} ${today().getFullYear()}`);

const paid = computed(() => analytics.value.paidUsers);
const noPaid = computed(() => paid.value.active === 0);
const noPrices = computed(() => paid.value.active > 0 && paid.value.priced === 0);
const partialPrices = computed(() => paid.value.priced > 0 && paid.value.priced < paid.value.active);

// «16.09–15.10» (RU) / «Sep 16 – Oct 15» (EN): конец периода показываем
// включительно, бэкенд отдаёт полуинтервал.
const periodText = computed(() => {
  const start = new Date(analytics.value.period.start);
  const end = new Date(analytics.value.period.end);
  end.setDate(end.getDate() - 1);
  if (locale.value === 'ru') return `${formatShort(start)}–${formatShort(end)}`;
  const en = (d) => `${monthsShort.value[d.getMonth()]} ${d.getDate()}`;
  return `${en(start)} – ${en(end)}`;
});

// Прогноз прибыли ниже нуля не показываем: без части цен продажи выручка
// занижена, и минус вводил бы в заблуждение (рядом - подсказка про цены).
const statCards = computed(() => {
  const e = analytics.value.economics;
  const hasPrices = paid.value.priced > 0;
  const profit = Math.max(0, e.forecastProfit);
  return [
    {
      id: 'revenue',
      label: t('pro.analytics.cards.revenue.label'),
      value: hasPrices ? money(e.expectedRevenue) : '—',
      hint: t('pro.analytics.cards.revenue.text'),
      tip: t('pro.analytics.cards.revenue.tip'),
      tone: hasPrices ? 'ink' : 'muted',
    },
    {
      id: 'cost',
      label: t('pro.analytics.cards.cost.label'),
      value: money(e.forecastKeyCost),
      hint: t('pro.analytics.cards.cost.text'),
      tip: t('pro.analytics.cards.cost.tip'),
      tone: 'ink',
    },
    {
      id: 'profit',
      label: t('pro.analytics.cards.profit.label'),
      value: hasPrices ? money(profit) : '—',
      hint: t('pro.analytics.cards.profit.text'),
      tip: t('pro.analytics.cards.profit.tip'),
      tone: hasPrices && profit > 0 ? 'green' : 'muted',
      main: true,
    },
  ];
});

// График по календарным месяцам; текущий - прогноз (красный столбец).
const chartBars = computed(() => {
  const {months} = analytics.value;
  const maxRev = months.reduce((max, m) => Math.max(max, m.available ? m.expected : 0), 1);
  return months.map((m, i) => {
    const monthIndex = Number(m.month.slice(5, 7)) - 1;
    const year = m.month.slice(0, 4);
    const isLast = i === months.length - 1;
    const label = monthsShort.value[monthIndex];
    const detail = m.available
      ? {
        title: `${monthsFull.value[monthIndex]} ${year}`,
        rows: [
          {label: t('pro.analytics.chart.revenue'), value: money(m.expected)},
          {label: t('pro.analytics.chart.costs'), value: money(m.cost)},
          {label: t('pro.analytics.chart.profit'), value: money(m.profit)},
        ],
      }
      : null;
    return {
      key: m.month,
      label,
      sub: isLast ? t('pro.analytics.chart.forecast') : '',
      value: m.available ? money(m.expected) : '—',
      height: `${m.available ? Math.max(6, Math.round(m.expected / maxRev * 130)) : 6}px`,
      isLast,
      aria: detail ? `${detail.title}: ${detail.rows.map((r) => `${r.label} ${r.value}`).join(', ')}` : `${label}: ${t('pro.analytics.chart.noData')}`,
      detail,
    };
  });
});

// Рекомендации: проблемные сценарии (только с ненулевым счётчиком) с CTA в
// отфильтрованный список, затем позитивные состояния; совсем без сигналов -
// «Пока все спокойно».
const attentionCards = computed(() => {
  const {recommendations: r, renewals, thresholds} = analytics.value;
  const cards = [];

  const problem = (id, rec, tone, icon, sort, params = {}) => {
    if (!rec.count) return;
    cards.push({
      id,
      tone,
      icon,
      title: t(`pro.analytics.attention.${id}.title`, {n: rec.count}, rec.count),
      body: t(`pro.analytics.attention.${id}.body`, params),
      cta: t('pro.analytics.attention.cta'),
      ids: rec.ids,
      sort,
      label: t(`pro.toolbar.preset.${id}`, params),
    });
  };

  problem('notRenewed', r.notRenewed, 'red', '✕', 'until');
  problem('highUsage', r.basicHighUsage, 'blue', '↯', 'traffic', {pct: thresholds.basicHighUsagePct});
  problem('atLimit', r.basicAtLimit, 'amber', '▲', 'traffic');
  problem('inactive', r.inactivePaid, 'amber', '☾', 'last', {days: thresholds.inactiveDays});

  if (renewals.good) {
    cards.push({id: 'staying', tone: 'green', icon: '✓', title: t('pro.analytics.attention.staying.title'), body: t('pro.analytics.attention.staying.body', {pct: renewals.rate})});
  }
  if (paid.value.net > 0) {
    cards.push({id: 'growing', tone: 'green', icon: '↗', title: t('pro.analytics.attention.growing.title'), body: t('pro.analytics.attention.growing.body', {n: paid.value.net}, paid.value.net)});
  }
  if (!cards.length) {
    cards.push({id: 'quiet', tone: 'ink', icon: '◦', title: t('pro.analytics.attention.quiet.title'), body: t('pro.analytics.attention.quiet.body')});
  }
  return cards;
});

const goKeys = () => router.push({path: '/', query: route.query});

const onAction = (card) => {
  if (!card.ids?.length) return;
  filterStore.applyPreset({ids: card.ids, label: card.label, sort: card.sort, viewMode: 'table'});
  goKeys();
};

// Пустые состояния: создать первый платный ключ / указать цены платным без цены.
const goCreate = () => router.push({path: '/', query: {...route.query, create: '1'}});

const goPrices = () => {
  const ids = keysList.value.filter((k) => k.tier !== 'free' && !k.off && !(k.sold > 0)).map((k) => k.id);
  filterStore.applyPreset({ids: ids.length ? ids : null, label: t('pro.toolbar.preset.unpriced'), viewMode: 'table'});
  goKeys();
};
</script>
