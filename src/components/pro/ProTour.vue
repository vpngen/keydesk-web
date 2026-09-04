<template>
  <div class="pro-tour">
    <div class="pro-tour__window">
      <div class="pro-tour__head">
        <div class="pro-tour__brand">
          <div class="pro-tour__wordmark">
            <span class="pro-tour__wordmark-accent">VPN</span><span>.GENERATOR</span>
          </div>
          <div class="pro-tour__stamp">PRO</div>
        </div>
        <button class="pro-tour__skip" type="button" @click="emit('close')">
          {{ t('pro.tour.skip') }} ✕
        </button>
      </div>
      <div class="pro-tour__body">
        <div class="pro-tour__step-label">{{ t(`pro.tour.s${step}.label`) }}</div>
        <div class="pro-tour__title">{{ t(`pro.tour.s${step}.title`) }}</div>
        <div class="pro-tour__text">{{ t(`pro.tour.s${step}.text`) }}</div>
        <div v-if="cards.length" class="pro-tour__cards">
          <div v-for="card in cards" :key="card.name" class="pro-tour__card">
            <div class="pro-tour__card-head">
              <div class="pro-tour__card-name">{{ card.name }}</div>
              <div class="pro-tour__card-price">{{ card.price }}</div>
            </div>
            <div class="pro-tour__card-body">{{ card.body }}</div>
          </div>
        </div>
      </div>
      <div class="pro-tour__foot">
        <div class="pro-tour__dots">
          <div
            v-for="i in TOTAL_STEPS"
            :key="i"
            :class="{'pro-tour__dot--active': i === step}"
            class="pro-tour__dot"
          ></div>
        </div>
        <div class="pro-tour__actions">
          <button v-if="step > 1" class="pro-tour__back" type="button" @click="step -= 1">
            {{ t('pro.tour.back') }}
          </button>
          <button
            :class="{'pro-tour__next--final': step === TOTAL_STEPS}"
            class="pro-tour__next"
            type="button"
            @click="next"
          >
            {{ t(`pro.tour.s${step}.cta`) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';

const emit = defineEmits(['close']);

const TOTAL_STEPS = 7;
const CARD_STEPS = {2: 3, 5: 3};

const {t, tm} = useI18n();

const step = ref(1);

const cards = computed(() => {
  const count = CARD_STEPS[step.value];
  if (!count) return [];
  const list = tm(`pro.tour.s${step.value}.cards`);
  return Array.isArray(list) ? list : [];
});

const next = () => {
  if (step.value >= TOTAL_STEPS) {
    emit('close');
    return;
  }
  step.value += 1;
};
</script>
