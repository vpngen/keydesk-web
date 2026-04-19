<template>
  <div class="popup">
    <div class="popup__overlay" @click="close"/>
    <div class="popup__alert">
      <div class="popup__close" @click="close">
        <SvgIcon name="icon-close"/>
      </div>
      <div class="popup__name">
        {{ displayName(userName) }}
      </div>
      <QRCodeVue3
        v-if="showQrCode"
        :backgroundOptions="{ color: 'transparent' }"
        :cornersDotOptions="{ type: undefined, color: '#1D4365' }"
        :cornersSquareOptions="{ type: 'extra-rounded', color: '#1D4365' }"
        :dotsOptions="{
					type: 'rounded',
					color: '#1D4365',
				}"
        :height="500"
        :imageOptions="{ hideBackgroundDots: true, imageSize: 0.3, margin: 0}"
        :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
        :value="qrCode"
        :width="500"
        fileExt="svg"
        myclass="qr-code"
      />
      <div v-else class="popup__emoji">
        <SvgIcon name="icon-emoji-happy"/>
      </div>
      <div class="popup__title qr-title">
        {{ t('cabinet.dialogQr.done') }}
      </div>
      <div v-if="showQrCode" class="popup__subtitle">
        {{ t('cabinet.dialogQr.subtitleQr') }}
        <span class="tunnel">
					{{ t('cabinet.dialogQr.tunnelPrefix') }} <b>{{ tunnelName }}</b>
				</span>
        <span v-if="vpnName" class="tunnel">{{ vpnName }}</span>
      </div>
      <div v-else class="popup__subtitle popup__subtitle--minimize-margin">
        {{ t('cabinet.dialogQr.subtitleOutline') }}
      </div>
      <!--<div class="popup__subtitle">-->
      <!--	{{ vpnName }}: -->
      <!--	<span>-->
      <!--		<a :href="osLink" target="_blank">{{ osLink }}</a>-->
      <!--	</span>-->
      <!--</div>-->
      <div v-if="props.configName !== 'VPNGenConfig'" class="popup__buttons popup__buttons--qr">
        <button class="button button--option2 popup__action no-border" @click="others">
          <span>{{ t('cabinet.dialogQr.otherOptions') }}</span>
        </button>
        <a :download="buttonDownload" :href="buttonHref" class="button button--option2 popup__action">
					<span class="popup__button-img">
						<SvgIcon name="download"/>
					</span>
          <span>{{ t('cabinet.dialogQr.downloadData') }}</span>
        </a>
      </div>
      <div v-else class="popup__outline-block">
        <!--<div class="popup__outline-header">Ссылка конфига:</div>-->
        <div class="popup__outline-link" @click="copyText">
          <input ref="outlineLinkRef" :value="outlineLink" readonly="readonly"/>
          <span>
						<SvgIcon name="icon-copy"/>
					</span>
          <p v-show="linkCopy">{{ t('cabinet.dialogQr.copiedShort') }}</p>
        </div>
        <span class="popup__outline-footer">
					{{ t('cabinet.dialogQr.outlineFooter') }}
				</span>
        <div class="popup__buttons popup__buttons--qr">
          <button class="popup__button button button--option2" @click="copyText">
            <SvgIcon name="link"/>
            {{ t('cabinet.dialogQr.copyLink') }}
          </button>
          <button v-if="window.location.protocol === 'https:'" class="popup__button button button--option2"
                  @click="share">
						<span>
							<SvgIcon name="icon-share"/>
							{{ t('cabinet.dialogQr.share') }}
						</span>
          </button>
        </div>
      </div>
      <div v-if="linkCopyResult" :class="{'popup__copy-success':isLinkCopied, 'popup__copy-error':!isLinkCopied}"
           class="popup__link-copy-result">
        {{ linkCopyResult }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watchEffect} from 'vue';
import QRCodeVue3 from 'qrcode-vue3';
import SvgIcon from './SvgIcon.vue';
import {useI18n} from 'vue-i18n';
import {displayVpnNameFromConfig} from '@/utils/vpnConfigDisplay';
import {useDisplayPersonName} from '@/composables/useDisplayPersonName';

const {t, locale} = useI18n();
const {displayName} = useDisplayPersonName();

const props = defineProps({
  userData: {
    type: Object
  },
  title: {
    type: String
  },
  configName: {
    type: String
  },
  chosenOS: {
    type: String
  }
});

const qrCode = ref(new Blob([]))
const outlineLinkRef = ref('');
const userName = ref('');
const tunnelName = ref('');
const buttonHref = ref('');
const buttonDownload = ref('');
const configList = require('../../vpn_sistems_config.json');
const isLinkCopied = ref(true);
const linkCopyResult = ref('');
const linkButtonText = ref('Скопировать');
const linkCopy = ref(false);
const showQrCode = ref(false);

const copyText = () => {
  if (linkCopy.value) {
    return;
  }

  linkCopy.value = true;
  const text = outlineLinkRef.value.value;
  const tempElement = document.createElement('textarea');
  tempElement.value = text;
  document.body.appendChild(tempElement);
  tempElement.select();
  document.execCommand('copy');
  document.body.removeChild(tempElement);

  setTimeout(() => {
    linkCopy.value = false;
  }, 2000);
};

const share = () => {
  const shareText = t('cabinet.dialogQr.shareBody', {link: outlineLink.value});

  if (navigator.share) {
    navigator.share({
      title: t('cabinet.dialogQr.shareTitle'),
      text: shareText
    })
  } else {
    isLinkCopied.value = false;
    linkCopyResult.value = t('cabinet.dialogQr.shareUnsupported');
  }
}

const osLink = computed(() => {
  const chosenConfig = props.configName ? props.configName : 'WireguardConfig';
  const osKey = typeof props.chosenOS === 'object' && props.chosenOS?.value != null
    ? props.chosenOS.value
    : props.chosenOS;
  return configList.links_defaults[osKey]?.[chosenConfig];
});

const outlineLink = computed(() => {
  return props.configName === 'VPNGenConfig' ? props.userData[props.configName] : ''
})

const vpnName = computed(() => {
  return displayVpnNameFromConfig(props.configName, configList.vpn_name, locale.value);
})

watchEffect(() => {
  const userConfig = props.userData;
  if (userConfig) {
    qrCode.value = userConfig[props.configName]?.FileContent;
    userName.value = userConfig.UserName;
    tunnelName.value = userConfig[props.configName]?.TonnelName;
    buttonHref.value = window.URL.createObjectURL(new Blob([qrCode.value], {type: 'application/conf'}));
    buttonDownload.value = userConfig[props.configName]?.FileName;
  }
});

const image = require('@/assets/images/sprites/png/logo-vpn.png')

// const share = async () => {
//   if (navigator.canShare({ files: [props.file] })) {
//     try {
//       await navigator.share({
// 				files: [props.file],
// 				title: props.fileName
// 			})
//     } catch (error) {
//       alert(`Error: ${error.message}`)
//     }
//   } else {
//     alert(`Your system doesn't support sharing these files.`)
//   }
// }

const copy = async () => {
  await navigator.clipboard.writeText(qrCode.value);
}

const copyLink = async (target) => {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(target.innerText);
      isLinkCopied.value = true;
      linkButtonText.value = 'Скопировано'
      linkCopyResult.value = 'Ссылка скопирована в буфер обмена!'
    } catch (error) {
      isLinkCopied.value = false;
      linkCopyResult.value = 'Копирование не поддерживается твоим устройством. Скопируй пожалуйста ссылку ручками:)'
    }
  } else {
    isLinkCopied.value = false;
    linkCopyResult.value = 'Копирование не поддерживается твоим устройством. Скопируй пожалуйста ссылку ручками:)'
  }
}

const emit = defineEmits([
  'close',
  'others'
]);

const close = () => {
  emit('close');
};

const others = () => {
  emit('others');
};

</script>
