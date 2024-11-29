<template>
	<div class="popup">
		<div class="popup__overlay" @click="close" />
		<div class="popup__alert">
			<div class="popup__emoji">
				<SvgIcon name="icon-construction" />
			</div>
			<div class="popup__title qr-title">
				У нас технические работы
			</div>
			<div class="popup__subtitle popup__subtitle--minimize-margin">
				Ожидаемое время их окончания:
			</div>
			<div class="popup__title qr-title title-regular">
				{{ till }}
			</div>
			<div class="popup__subtitle popup__subtitle--minimize-margin">
				Так что не беспокойся, скорее всего все под контролем.
			</div>
			<div class="popup__title qr-title">
				{{ message }}
			</div>
		</div>
	</div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue';

const props = defineProps({
	till: {
		type: String
	},
	message: {
		type: String
	},
});

</script>
