<template lang="pug">
include ../../assets/pug/base.pug

+b.MAIN.home
  +e.SECTION.section--notifications
    Notifications
</template>

<script setup>
import Notifications from '@/components/Notifications.vue';
</script>
