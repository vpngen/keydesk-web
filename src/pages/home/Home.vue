<template>
	<ProKeys v-if="isProLayout"/>
	<main v-else class="home">
		<section class="home__section home__section--profile">
			<Profile />
		</section>
	</main>
</template>

<script setup>
import Profile from '@/components/profile/Profile.vue';
import ProKeys from '@/components/pro/keys/ProKeys.vue';
import { useProLayout } from '@/composables/useProLayout';

const { isProLayout } = useProLayout();
</script>
