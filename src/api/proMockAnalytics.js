/**
 * Аналитика для мок-стенда (dev/stage без PRO-claim): приближение той же
 * структуры, что отдаёт GET /pro/analytics, посчитанное по списку ключей.
 * Реальная PRO-бригада эти цифры никогда не видит - см. fetchProAnalytics.
 */

import {REVENUE_HISTORY} from '@/api/proMockData';
import {tierPrice, usedGb} from '@/utils/proKeys';
import {daysSinceVisit, monthShift, toIso} from '@/utils/proFormat';

const MOCK_THRESHOLDS = {basicHighUsagePct: 80, inactiveDays: 14, goodRenewalPct: 75};

const sum = (list, pick) => list.reduce((acc, item) => acc + (pick(item) || 0), 0);

const group = (keys) => {
  const priced = keys.filter((k) => (k.sold || 0) > 0);
  return {
    count: keys.length,
    priced: priced.length,
    share: 0,
    avgPrice: priced.length ? Math.round(sum(priced, (k) => k.sold) / priced.length * 100) / 100 : 0,
  };
};

export function buildMockAnalytics(keys) {
  const paid = keys.filter((k) => k.tier !== 'free');
  const active = paid.filter((k) => !k.off);
  const priced = active.filter((k) => (k.sold || 0) > 0);
  const expectedRevenue = sum(priced, (k) => k.sold);
  const forecastKeyCost = sum(active, (k) => tierPrice(k.tier));

  const basic = group(active.filter((k) => k.tier === 'basic'));
  const unlim = group(active.filter((k) => k.tier === 'unlim'));
  if (active.length) {
    basic.share = Math.round(basic.count / active.length * 100);
    unlim.share = 100 - basic.share;
  }

  const stoppedKeys = paid.filter((k) => k.off);
  const newKeys = active.filter((k) => k.createdAt && daysSinceVisit(k.createdAt) < 30);
  const highUsage = active.filter((k) => k.tier === 'basic' && (usedGb(k) ?? 0) >= 80 && (usedGb(k) ?? 0) < 100);
  const atLimit = active.filter((k) => k.tier === 'basic' && (usedGb(k) ?? 0) >= 100);
  const inactive = active.filter((k) => k.lastVisit && daysSinceVisit(k.lastVisit) >= MOCK_THRESHOLDS.inactiveDays);

  const eligible = active.length + stoppedKeys.length;
  const rate = eligible ? Math.round(active.length / eligible * 100) : 0;

  const months = [...REVENUE_HISTORY, expectedRevenue].map((value, i) => {
    const start = monthShift(i - REVENUE_HISTORY.length);
    const cost = i === REVENUE_HISTORY.length ? forecastKeyCost : Math.round(value * 0.4 * 100) / 100;
    return {
      month: toIso(start).slice(0, 7),
      available: true,
      reconstructed: false,
      expected: value,
      cost,
      profit: Math.round((value - cost) * 100) / 100,
    };
  });

  return {
    period: {start: monthShift(0).toISOString(), end: monthShift(1).toISOString(), index: 1},
    economics: {
      expectedRevenue,
      forecastKeyCost,
      forecastProfit: Math.round((expectedRevenue - forecastKeyCost) * 100) / 100,
    },
    paidUsers: {
      active: active.length,
      newCount: newKeys.length,
      stopped: stoppedKeys.length,
      net: newKeys.length - stoppedKeys.length,
      priced: priced.length,
      basic,
      unlim,
    },
    renewals: {
      status: eligible ? 'final' : 'no_data',
      eligible,
      renewed: active.length,
      rate,
      changePp: eligible ? 5 : null,
      good: eligible > 0 && rate >= MOCK_THRESHOLDS.goodRenewalPct,
    },
    recommendations: {
      notRenewed: {count: stoppedKeys.length, ids: stoppedKeys.map((k) => k.id)},
      basicHighUsage: {count: highUsage.length, ids: highUsage.map((k) => k.id)},
      basicAtLimit: {count: atLimit.length, ids: atLimit.map((k) => k.id)},
      inactivePaid: {count: inactive.length, ids: inactive.map((k) => k.id)},
    },
    thresholds: {...MOCK_THRESHOLDS},
    months,
  };
}
