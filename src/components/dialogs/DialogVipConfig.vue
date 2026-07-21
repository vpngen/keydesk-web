<template>
  <div class="popup">
    <div class="popup__overlay" @click="close"/>
    <div class="popup__alert">
      <div class="popup__close" @click="close">
        <SvgIcon name="icon-close"/>
      </div>
      <div class="popup__name">
        {{ title }}
      </div>
      <div class="popup__emoji">
        <SvgIcon name="icon-emoji-happy-vip"/>
      </div>
      <div class="popup__title qr-title">
        {{ t('cabinet.dialogVipConfig.title') }}
      </div>
      <div class="popup__subtitle popup__subtitle--minimize-margin">
        {{ t('cabinet.dialogVipConfig.subtitle') }}
      </div>

      <div class="popup__outline-block">
        <div class="popup__outline-link" @click="copyText">
          <input ref="outlineLinkRef" :value="vipConfig" readonly="readonly"/>
          <span>
            <SvgIcon name="icon-copy"/>
          </span>
          <p v-show="linkCopy">{{ t('cabinet.dialogVipConfig.copiedShort') }}</p>
        </div>
        <span class="popup__outline-footer">
        </span>
        <div class="popup__buttons popup__buttons--qr">
          <button class="popup__button button button--option2" type="button" @click="copyText">
            <SvgIcon name="link"/>
            {{ t('cabinet.dialogVipConfig.copyLink') }}
          </button>
          <button
            v-if="window.location.protocol === 'https:'"
            class="popup__button button button--option2"
            type="button"
                  @click="share">
						<span>
							<SvgIcon name="icon-share"/>
							{{ t('cabinet.dialogVipConfig.share') }}
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
import {ref} from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  vipConfig: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

const outlineLinkRef = ref('');
const isLinkCopied = ref(true);
const linkCopyResult = ref('');
const linkCopy = ref(false);

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

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const share = () => {
  const shareText = t('cabinet.dialogVipConfig.shareBody', {link: props.vipConfig});

  if (navigator.share) {
    navigator.share({
      title: t('cabinet.dialogVipConfig.shareTitle'),
      text: shareText
    })
  } else {
    isLinkCopied.value = false;
    linkCopyResult.value = t('cabinet.dialogVipConfig.shareUnsupported');
  }
}
</script>
