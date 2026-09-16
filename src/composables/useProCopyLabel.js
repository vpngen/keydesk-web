import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useProKeysStore} from '@/store/proKeys';
import {availableProtos, defaultFormat} from '@/utils/proKeys';

/**
 * Подпись действия копирования по выбранным на карточке протоколу и формату:
 * «ключ» - строка выбранного протокола («Скопировать ключ VLESS»),
 * «ссылка» - страница ключа VPNGen, одна на ключ («Скопировать ссылку на ключ»).
 */
export function useProCopyLabel(keyRef) {
  const {t} = useI18n();
  const {protoByKey, formatByKey} = storeToRefs(useProKeysStore());

  const format = computed(() => formatByKey.value[keyRef.value.id] || defaultFormat(keyRef.value));

  const proto = computed(() => {
    const protos = availableProtos(keyRef.value);
    let current = protoByKey.value[keyRef.value.id] || keyRef.value.proto;
    if (protos && protos.length && !protos.includes(current)) [current] = protos;
    return current;
  });

  const label = computed(() => (format.value === 'link'
    ? t('pro.card.copyLink')
    : t('pro.card.copyKeyProto', {proto: t(`pro.protocols.${proto.value}`)})));

  return {format, proto, label};
}
