<template>
  <div class="pro-proto">
    <div class="pro-proto__row">
      <div class="pro-proto__group">
        <button
          v-for="p in PRO_PROTOCOLS"
          :key="p"
          :class="{'pro-proto__chip--active': currentProto === p}"
          class="pro-proto__chip"
          type="button"
          @click.stop="proKeysStore.setKeyProto(keyItem.id, p)"
        >
          {{ t(`pro.protocols.${p}`) }}
        </button>
      </div>
      <div class="pro-proto__group">
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
    <div :title="value" class="pro-proto__value">{{ value }}</div>
    <slot/>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useProKeysStore} from '@/store/proKeys';
import {keyString} from '@/utils/proKeys';
import {PRO_PROTOCOLS, PRO_FORMATS} from '@/assets/constants/proConstants';

const props = defineProps({
  keyItem: {
    type: Object,
    required: true,
  },
});

const {t} = useI18n();
const proKeysStore = useProKeysStore();
const {protoByKey, formatByKey} = storeToRefs(proKeysStore);

const currentProto = computed(() => protoByKey.value[props.keyItem.id] || props.keyItem.proto);
const currentFormat = computed(() => formatByKey.value[props.keyItem.id] || 'link');
const value = computed(() => keyString(props.keyItem, currentProto.value, currentFormat.value));
</script>
