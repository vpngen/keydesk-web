<template lang='pug'>
include assets/pug/base
HeaderInset
+b.MAIN.home
  +e.SECTION.section--profile
    Profile
Footer
TheLoader
</template>

<script setup>
import Profile from './components/Profile.vue';
import HeaderInset from './components/HeaderInset.vue';
import Footer from './components/Footer.vue';
import TheLoader from "@/components/TheLoader.vue";

</script>

<style src="./assets/scss/main.scss" lang="scss"></style>
