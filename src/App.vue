<template>
	<HeaderInset />
	<RouterView />
	<Footer />
	<TheLoader />
</template>

<script setup>
import HeaderInset from './components/HeaderInset.vue';
import Footer from './components/Footer.vue';
import TheLoader from "@/components/TheLoader.vue";

</script>

<style src="./assets/scss/main.scss" lang="scss"></style>
