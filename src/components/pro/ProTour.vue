<template>
  <div
    :class="{'pro-tour--spotlit': Boolean(spot), 'pro-tour--bottom': placement === 'bottom', 'pro-tour--side': placement === 'side'}"
    :style="{paddingTop: `${topOffset}px`}"
    class="pro-tour"
  >
    <!-- «Дырка» в затемнении вокруг целевого элемента шага -->
    <div
      v-if="spot"
      :style="{top: `${spot.top}px`, left: `${spot.left}px`, width: `${spot.width}px`, height: `${spot.height}px`}"
      class="pro-tour__spotlight"
    ></div>

    <div ref="windowRef" class="pro-tour__window">
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
import {computed, nextTick, onBeforeUnmount, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';

const emit = defineEmits(['close']);

const TOTAL_STEPS = 7;
// Карточки тарифов только на шаге 2: правила оплаты (шаг 5) теперь текстом.
const CARD_STEPS = {2: 3};
// Отступ окна от шапки (и от края экрана, когда шапка уже проскроллена).
const TOP_GAP = 24;

// Каждый шаг открывает свой раздел и подсвечивает элемент, о котором говорит.
const STEPS = {
  1: {path: '/', target: '[data-tour="banner"]'},
  2: {path: '/', target: '.pro-key-card__tariff, .pro-key-table__tariff'},
  3: {path: '/', target: '[data-tour="view-toggle"]'},
  4: {path: '/', target: '[data-tour="new-key"]'},
  5: {path: '/invoices', target: '[data-tour="invoices-state"], .pro-invoices__grid'},
  6: {path: '/analytics', target: '.pro-advice-card, [data-tour="advice"]'},
  7: {path: '/', target: '[data-tour="nav-tour"]'},
};

const {t, tm} = useI18n();
const route = useRoute();
const router = useRouter();

const step = ref(1);
const windowRef = ref(null);
const spot = ref(null);
const placement = ref('top');
const topOffset = ref(TOP_GAP);

let targetEl = null;

const cards = computed(() => {
  const count = CARD_STEPS[step.value];
  if (!count) return [];
  const list = tm(`pro.tour.s${step.value}.cards`);
  return Array.isArray(list) ? list : [];
});

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

const measureTop = () => {
  const header = document.querySelector('.pro-header');
  const bottom = header ? header.getBoundingClientRect().bottom : 0;
  topOffset.value = Math.max(TOP_GAP, Math.round(bottom) + TOP_GAP);
};

const measureSpot = () => {
  if (!targetEl || !targetEl.isConnected) {
    spot.value = null;
    return;
  }
  const r = targetEl.getBoundingClientRect();
  spot.value = {top: r.top - 6, left: r.left - 6, width: r.width + 12, height: r.height + 12};
};

// Минимальная ширина экрана, на которой окно можно увести вбок от цели.
const SIDE_MIN_WIDTH = 1200;

const overlapsTarget = () => {
  if (!spot.value || !windowRef.value) return false;
  const w = windowRef.value.getBoundingClientRect();
  const s = spot.value;
  return w.left < s.left + s.width && w.left + w.width > s.left
    && w.top < s.top + s.height && w.top + w.height > s.top;
};

// Окно не должно перекрывать цель: сначала ставим его сверху (и даём DOM
// перерисоваться - иначе измеряем позицию прошлого шага), при пересечении
// опускаем вниз экрана.
const choosePlacement = async () => {
  placement.value = 'top';
  await nextTick();
  if (!overlapsTarget()) return;
  placement.value = 'bottom';
  await nextTick();
  // Всё ещё пересекаются (цель в середине экрана) - прижимаем цель к верху.
  if (overlapsTarget() && targetEl) {
    targetEl.scrollIntoView({block: 'start', behavior: 'auto'});
    measureTop();
    measureSpot();
    await nextTick();
  }
  // Короткая страница, скроллить некуда: на широком экране уводим окно вбок.
  if (overlapsTarget() && window.innerWidth >= SIDE_MIN_WIDTH) {
    placement.value = 'side';
    await nextTick();
  }
};

const onViewportChange = () => {
  measureTop();
  measureSpot();
};

const applyStep = async () => {
  const cfg = STEPS[step.value];
  targetEl = null;
  spot.value = null;

  if (cfg.path !== route.path) {
    await router.push({path: cfg.path, query: route.query});
    await nextTick();
    await sleep(120);
  }

  targetEl = document.querySelector(cfg.target);
  if (targetEl) {
    // Высокую цель прижимаем к верху экрана, чтобы окно снизу её не накрыло.
    const tall = targetEl.getBoundingClientRect().height > window.innerHeight * 0.45;
    targetEl.scrollIntoView({block: tall ? 'start' : 'center', behavior: 'auto'});
  } else {
    window.scrollTo({top: 0});
  }
  await nextTick();
  measureTop();
  measureSpot();
  await choosePlacement();
};

watch(step, applyStep, {immediate: true});

window.addEventListener('scroll', onViewportChange, {passive: true});
window.addEventListener('resize', onViewportChange, {passive: true});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onViewportChange);
  window.removeEventListener('resize', onViewportChange);
});

const next = async () => {
  if (step.value >= TOTAL_STEPS) {
    // «К ключам»: завершение тура возвращает в Ключницу.
    if (route.path !== '/') await router.push({path: '/', query: route.query});
    emit('close');
    return;
  }
  step.value += 1;
};
</script>
