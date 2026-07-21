<template>
  <div>
    <div class="profile__table">
      <div class="profile__table-head">
        <div class="profile__table-title">
          {{ t('cabinet.dataTable.type') }}
        </div>
        <div class="profile__table-column">
          {{ t('cabinet.dataTable.user') }}
        </div>
        <div class="profile__table-column">
          {{ t('cabinet.dataTable.brigadier') }}
        </div>
      </div>
      <template v-for="line in lines" :key="line.type">
        <div class="profile__table-line">
          <div class="profile__table-title">
            {{ line.type }}
          </div>
          <div :class="{'tooltip': line.user}" :data-user="line.user" class="profile__table-column">
            <SvgIcon :name="`icon-status-${line.user ? 'on' : 'off'}`"/>
          </div>
          <div :class="{'tooltip': line.brigadier}" :data-user="line.brigadier" class="profile__table-column">
            <SvgIcon :name="`icon-status-${line.brigadier ? 'on' : 'off'}`"/>
          </div>
        </div>
      </template>
    </div>
    <p class="profile__chart-note">
      {{ t('cabinet.dataNote') }}
    </p>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import SvgIcon from '@/components/SvgIcon.vue';

const {t, tm} = useI18n();

const lines = computed(() => tm('cabinet.dataCollection') || []);
</script>
