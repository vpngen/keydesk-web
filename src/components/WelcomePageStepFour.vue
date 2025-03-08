<template>
	<div class="popup popup--welcome">
		<div class="popup__overlay welcome" />
		<div class="popup__overlay qr"/>
		<div class="popup__alert welcome-qr" ref="endLine">
			<div class="popup__close">
				<SvgIcon name="icon-close" />
			</div>
			<div class="popup__name">
				220 Шаловливый Кример
			</div>
			
			<div class="popup__emoji" >
				<SvgIcon name="icon-emoji-happy" />
			</div>

			<div class="popup__title qr-title">
				Настройки для VPN готовы!
			</div>

			<div class="popup__subtitle popup__subtitle--minimize-margin">
				Поделись с другом ссылкой ниже. Ему нужно перейти по ней и следовать инструкциям.
			</div>

			<div class="popup__outline-block">
				
				<div class="popup__outline-link" >
					<input ref="outlineLinkRef" value="http://152.89.168.95/vgc://afokaglkslfjlsdfsldkfsdfksjdflksdjflsqweq2..." readonly="readonly"/>
					<span>
						<SvgIcon name="icon-copy" />
					</span>				
				</div>
				<span class="popup__outline-footer">
					Ты не сможешь сам перейти по этой ссылке под своим VPN, так мы защитили твой ключ от перезаписи
				</span>
				<div class="popup__buttons popup__buttons--qr">
					<button class="popup__button button button--option2">
						<span>
							<SvgIcon name="link" />
							Копировать ссылку
						</span>
					</button>
					<button  class="popup__button button button--option2">
						<span>
							<SvgIcon name="icon-share" />
							Поделиться
						</span>
					</button>
				</div>
			</div>			
		</div>
		<div class="popup__alert welcome-qr-description" ref="startLine">
			<div class="popup__title qr-title-description">
				Настройки VPN для нового пользователя созданы!
				<br>Скопируй и поделись ими!
			</div>
			<div class="popup__button welcome">
				<button class="button button--welcome" @click="triggerStepFour">Далее</button>
			</div>
		</div>
		<div class="popup__text welcome bottom-close">
			<a @click="close">
				Пропустить
			</a>
		</div>
	</div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue';
import {onMounted, ref} from "vue";
import generateLines from "@/assets/helpers/animations";

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
