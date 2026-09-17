<template>
  <div class="pro-analytics__panel">
    <div class="pro-analytics__panel-head">
      <div class="pro-analytics__panel-title">
        {{ t('pro.analytics.paid.title') }}
        <ProHint :text="t('pro.analytics.paid.tip')"/>
      </div>
    </div>
    <div class="pro-analytics__paid">
      <div class="pro-analytics__paid-big">{{ paid.active }}</div>
      <div class="pro-analytics__paid-caption">{{ t('pro.analytics.paid.active') }}</div>
      <div class="pro-analytics__paid-split">{{ paid.basic.count }} Basic · {{ paid.unlim.count }} Unlim</div>

      <div class="pro-analytics__paid-cells">
        <div v-for="cell in cells" :key="cell.id" class="pro-analytics__paid-cell">
          <div :class="`pro-analytics__paid-cell-value--${cell.tone}`" class="pro-analytics__paid-cell-value">{{ cell.value }}</div>
          <div class="pro-analytics__paid-cell-label">
            {{ cell.label }}
            <ProHint :text="cell.tip"/>
          </div>
        </div>
      </div>

      <div class="pro-analytics__paid-structure">
        {{ t('pro.analytics.paid.structure') }}
        <ProHint :text="t('pro.analytics.paid.structureTip')"/>
      </div>
      <div v-for="group in groups" :key="group.id" class="pro-analytics__paid-group">
        <span :class="`pro-analytics__paid-dot--${group.id}`" class="pro-analytics__paid-dot"></span>
        <div class="pro-analytics__paid-group-name">{{ group.name }}</div>
        <div class="pro-analytics__paid-group-lines">
          <div>{{ t('pro.plurals.users', group.count) }} · {{ group.share }}%</div>
          <div class="pro-analytics__paid-group-price">
            {{ group.priced ? t('pro.analytics.paid.avgPrice', {amount: money(group.avgPrice)}) : t('pro.analytics.paid.noPrice') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import ProHint from '@/components/pro/analytics/ProHint.vue';
import {money} from '@/utils/proFormat';

const props = defineProps({
  // paidUsers из GET /pro/analytics: {active, newCount, stopped, net, priced, basic, unlim}.
  paid: {
    type: Object,
    required: true,
  },
});

const {t} = useI18n();

const signed = (n) => `${n > 0 ? '+' : ''}${n}`;

const cells = computed(() => [
  {id: 'new', value: `+${props.paid.newCount}`, tone: props.paid.newCount > 0 ? 'green' : 'muted', label: t('pro.analytics.paid.new'), tip: t('pro.analytics.paid.newTip')},
  {id: 'stopped', value: `−${props.paid.stopped}`, tone: props.paid.stopped > 0 ? 'red' : 'muted', label: t('pro.analytics.paid.stopped'), tip: t('pro.analytics.paid.stoppedTip')},
  {id: 'net', value: signed(props.paid.net), tone: props.paid.net > 0 ? 'green' : props.paid.net < 0 ? 'red' : 'muted', label: t('pro.analytics.paid.net'), tip: t('pro.analytics.paid.netTip')},
]);

const groups = computed(() => ['basic', 'unlim'].map((id) => ({
  id,
  name: t(`pro.tiers.${id}.name`),
  ...props.paid[id],
})));
</script>
