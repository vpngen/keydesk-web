<template>
  <div class="pro-proto">
    <div class="pro-proto__row">
      <div v-if="protos.length" class="pro-proto__group">
        <button
          v-for="p in protos"
          :key="p"
          :class="{'pro-proto__chip--active': currentProto === p}"
          class="pro-proto__chip"
          type="button"
          @click.stop="proKeysStore.setKeyProto(keyItem.id, p)"
        >
          {{ t(`pro.protocols.${p}`) }}
        </button>
      </div>
      <div v-if="protos.length || !keyItem.configs" class="pro-proto__group">
        <button
          v-for="f in PRO_FORMATS"
          :key="f"
          :class="{'pro-proto__chip--active': currentFormat === f}"
          class="pro-proto__chip"
          type="button"
          @click.stop="proKeysStore.setKeyFormat(keyItem.id, f)"
        >
          {{ t(`pro.formats.${f}`) }}
        </button>
      </div>
    </div>
    <div v-if="value" class="pro-proto__value-row">
      <div :title="value" class="pro-proto__value">{{ value }}</div>
      <button :title="t('pro.card.copyValue')" class="pro-proto__copy" type="button" @click.stop="emit('copy')">⧉</button>
    </div>
    <div v-else class="pro-proto__value pro-proto__value--empty">{{ t('pro.card.noStoredKey') }}</div>
    <slot/>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useProKeysStore} from '@/store/proKeys';
import {accessString, availableProtos, defaultFormat} from '@/utils/proKeys';
import {PRO_PROTOCOLS, PRO_FORMATS} from '@/assets/constants/proConstants';

const props = defineProps({
  keyItem: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['copy']);

const {t} = useI18n();
const proKeysStore = useProKeysStore();
const {protoByKey, formatByKey} = storeToRefs(proKeysStore);

const protos = computed(() => availableProtos(props.keyItem) || PRO_PROTOCOLS);
const currentProto = computed(() => {
  const selected = protoByKey.value[props.keyItem.id] || props.keyItem.proto;
  return protos.value.includes(selected) ? selected : protos.value[0];
});
const currentFormat = computed(() => formatByKey.value[props.keyItem.id] || defaultFormat(props.keyItem));
const value = computed(() => accessString(props.keyItem, currentProto.value, currentFormat.value));
</script>
