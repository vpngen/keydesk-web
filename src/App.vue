<template lang='pug'>
include assets/pug/base
HeaderInset
+b.MAIN.home
  +e.SECTION.section--profile
    Profile
Footer
</template>

<script setup>
import Profile from './components/Profile.vue';
import HeaderInset from './components/HeaderInset.vue';
import Footer from './components/Footer.vue';

</script>

<style src="./assets/scss/main.scss" lang="scss"></style>
