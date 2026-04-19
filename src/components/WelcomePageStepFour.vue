<template>
	<div class="popup popup--welcome">
		<div class="popup__overlay welcome" />
		<div class="popup__overlay qr"/>
		<div class="popup__alert welcome-qr" ref="endLine">
			<div class="popup__close">
				<SvgIcon name="icon-close" />
			</div>
			<div class="popup__name">
				{{ t('cabinet.welcome.step4.demoUserName') }}
			</div>
			
			<div class="popup__emoji" >
				<SvgIcon name="icon-emoji-happy" />
			</div>

			<div class="popup__title qr-title">
				{{ t('cabinet.welcome.step4.readyTitle') }}
			</div>

			<div class="popup__subtitle popup__subtitle--minimize-margin">
				{{ t('cabinet.welcome.step4.shareHint') }}
			</div>

			<div class="popup__outline-block">
				
				<div class="popup__outline-link" >
					<input ref="outlineLinkRef" value="http://152.89.168.95/vgc://afokaglkslfjlsdfsldkfsdfksjdflksdjflsqweq2..." readonly="readonly"/>
					<span>
						<SvgIcon name="icon-copy" />
					</span>				
				</div>
				<span class="popup__outline-footer">
					{{ t('cabinet.welcome.step4.linkFooter') }}
				</span>
				<div class="popup__buttons popup__buttons--qr">
					<button class="popup__button button button--option2" type="button">
						<span>
							<SvgIcon name="link" />
							{{ t('cabinet.welcome.step4.copyLink') }}
						</span>
					</button>
					<button class="popup__button button button--option2" type="button">
						<span>
							<SvgIcon name="icon-share" />
							{{ t('cabinet.welcome.step4.share') }}
						</span>
					</button>
				</div>
			</div>			
		</div>
		<div class="popup__alert welcome-qr-description" ref="startLine">
			<div class="popup__title qr-title-description">
				{{ t('cabinet.welcome.step4.descriptionTitle') }}
				<br>{{ t('cabinet.welcome.step4.descriptionSub') }}
			</div>
			<div class="popup__button welcome">
				<button class="button button--welcome" type="button" @click="triggerStepFour">{{ t('cabinet.welcome.common.next') }}</button>
			</div>
		</div>
		<div class="popup__text welcome bottom-close">
			<a @click="close">
				{{ t('cabinet.welcome.common.skip') }}
			</a>
		</div>
	</div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue';
import {onMounted, ref} from "vue";
import {useI18n} from 'vue-i18n';
import generateLines from "@/assets/helpers/animations";

const {t} = useI18n();

const emit = defineEmits(['close', 'initElementsContainerData']);
const startLine = ref(null);
const endLine = ref(null);

const { applySizePositionOptions, firstLine, secondLine, thirdLine } = generateLines(startLine, endLine,
		{endSocket: 'right', startSocket: 'bottom'},
		{endSocket: 'bottom', startSocket: 'top'},
		{endSocket: 'bottom', startSocket: 'top'},
		{x: '100%', y: '83%'});

const initElementsContainerData = () => {
	applySizePositionOptions(endLine, endLine);
	window.addEventListener('resize', ()=>applySizePositionOptions(endLine, endLine));
	window.addEventListener('scroll', ()=>applySizePositionOptions(endLine, endLine));
}

onMounted(() => {
	if (endLine.value) {
		initElementsContainerData(endLine.value, endLine.value);
	}
})

const close = () => {
  emit('close');
	firstLine.value.remove();
	secondLine.value.remove();
	thirdLine.value.remove();
};

const triggerStepFour = () => {
  emit('triggerStepFour');
	firstLine.value.remove();
	secondLine.value.remove();
	thirdLine.value.remove();
	emit('highlight');
};

</script>
