<template>
  <ProDialog
    :has-cancel="false"
    :hide-footer="!createdKey"
    :primary-label="t('pro.dialogs.create.toKeys')"
    :title="title"
    @close="emit('close')"
    @primary="emit('close')"
  >
    <!-- Единственный шаг: клик по тарифу сразу создаёт ключ. -->
    <template v-if="!createdKey">
      <ProTierOptions
        :model-value="tariff"
        :question="t('pro.dialogs.create.typeQuestion')"
        @update:model-value="pick"
      />
      <div v-if="creating" class="pro-dialog__body pro-dialog__body--status">
        <div class="pro-dialog__foot-note">{{ t('pro.dialogs.create.creating', {tier: t(`pro.tiers.${tariff}.name`)}) }}</div>
      </div>
    </template>

    <ProDonePanel
      v-else
      :key-value="doneKey"
      :note="doneNote"
      :stamp="t('pro.dialogs.create.doneStamp')"
      :sub="doneSub"
      :title="doneTitle"
    />
  </ProDialog>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import ProDialog from '@/components/pro/dialogs/ProDialog.vue';
import ProTierOptions from '@/components/pro/dialogs/ProTierOptions.vue';
import ProDonePanel from '@/components/pro/dialogs/ProDonePanel.vue';
import {tierPrice, accessString, defaultFormat} from '@/utils/proKeys';
import {money, formatIso} from '@/utils/proFormat';

const props = defineProps({
  createdKey: {
    type: [Object, null],
    default: null,
  },
  // Родитель держит запрос: блокируем повторные клики и показываем статус.
  creating: {type: Boolean},
});

const emit = defineEmits(['close', 'create']);

const {t} = useI18n();

const tariff = ref(null);

// Платный ключ = месячное списание с привязанной карты, поэтому срок — 1 месяц;
// название/комментарий/«продал за» задаются потом через шестерёнку.
const pick = (tier) => {
  if (props.creating || props.createdKey) return;
  tariff.value = tier;
  emit('create', {
    tier,
    proto: 'vless',
    months: 1,
    name: '',
    note: '',
    sold: 0,
  });
};

const tierName = computed(() => (tariff.value ? t(`pro.tiers.${tariff.value}.name`) : ''));

const title = computed(() => (tariff.value
  ? `${t('pro.dialogs.create.title')} · ${tierName.value}`
  : t('pro.dialogs.create.title')));

const doneKey = computed(() => (props.createdKey
  ? accessString(props.createdKey, props.createdKey.proto, defaultFormat(props.createdKey)) || ''
  : ''));

const doneTitle = computed(() => (tariff.value === 'free'
  ? t('pro.dialogs.create.doneTitleFree')
  : t('pro.dialogs.create.doneTitlePaid', {tier: tierName.value})));

const doneSub = computed(() => {
  if (!props.createdKey) return '';
  const until = props.createdKey.until
    ? t('pro.dialogs.done.until', {date: formatIso(props.createdKey.until)})
    : t('pro.card.termless');
  return `${props.createdKey.user} · ${tierName.value} · ${until}`;
});

const doneNote = computed(() => (tariff.value === 'free'
  ? t('pro.dialogs.create.doneNoteFree')
  : t('pro.dialogs.create.doneNotePaid', {price: money(tierPrice(tariff.value))})));
</script>
