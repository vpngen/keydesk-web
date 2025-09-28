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
        Твой хеви-лухари VIP-ключ!
      </div>
      <div class="popup__subtitle popup__subtitle--minimize-margin">
        Жми на ссылку и врывайся в интернет со скоростями, недоступными простым смертным и РКН.
      </div>

      <div class="popup__outline-block">
        <div class="popup__outline-link" @click="copyText">
          <input ref="outlineLinkRef" :value="vipConfig" readonly="readonly"/>
          <span>
            <SvgIcon name="icon-copy"/>
          </span>
          <p v-show="linkCopy">Скопировано</p>
        </div>
        <span class="popup__outline-footer">
        </span>
        <div class="popup__buttons popup__buttons--qr">
          <button class="popup__button button button--option2" @click="copyText">
            <SvgIcon name="link"/>
            Копировать ссылку
          </button>
          <button v-if="window.location.protocol === 'https:'" class="popup__button button button--option2"
                  @click="share">
						<span>
							<SvgIcon name="icon-share"/>
							Поделиться
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
import SvgIcon from './SvgIcon.vue';

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
  const shareText = `Перейди по ссылке и следуй инструкциям \n\n${props.vipConfig}`;

  if (navigator.share) {
    navigator.share({
      title: 'Ссылка на инструкцию',
      text: shareText
    })
  } else {
    isLinkCopied.value = false;
    linkCopyResult.value = 'Не поддерживается твоим браузером';
  }
}
</script>
