<template>
  <div class="profile__show-more-container">
    <div class="profile__show-more-column profile__show-more-column--mobile">
      <ShowMoreItem
        v-for="(card, index) in cardsList"
        :key="index"
        :extraContent="card.answers"
        :isExpanded="expandedQuestionIndex===index"
        :title="card.question"
        @setExpandedQuestionIndex=setExpandedQuestionIndex(index);
      />
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watchEffect} from 'vue';
import ShowMoreItem from "@/components/ShowMoreItem.vue";

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  isShown: {type: Boolean}
});

const expandedQuestionIndex = ref(null);

const cardsList = ref([
  {
    question: 'Как узнать, сколько у меня осталось трафика?',
    answers: [
      'Остаток отображается в карточке твоего пользователя (самая первая карточка в списке)',
    ]
  },
  {
    question: 'Как пользователю понять, сколько у него осталось трафика?',
    answers: [
      'Спросить у тебя, а ты посмотришь в его карточке',
    ]
  },
  {
    question: 'В какой стране находится мой сервер?',
    answers: [
      'Он точно находится за пределами РФ/РБ в приличной стране с верховенством закона. Где конкретно находится твой мы знаем, но тебе не скажем:)',
    ]
  },

  {
    question: 'А сколько у меня трафика вообще?',
    answers: [
      'На каждого пользователя выделяется по 100 ГБ. Лимиты обнуляются в начале каждого месяца.',
      'А если ты СУПЕР-VIP с безлимитным ключом — тогда полная свобода и никаких ограничений.',
    ]
  },

  {
    question: 'Сколько устройств я могу подключить к одной ключнице?',
    answers: [
      'В одной ключнице может быть одновременно 250 конфигов. Если чувствуешь, что подходишь к лимиту – вычисти тех, кто не активен (смотри по статусам “мертвая душа” и “ежик в тумане”)',
    ]
  },
  {
    question: 'А можно выбрать страну, к которой я подключаюсь?',
    answers: [
      'В текущей реализации — нет. Это не наш приоритет: мы сосредоточены на твоей безопасности и регулярно меняем IP-адреса.',
    ]
  },
  {
    question: 'А если кто-то получит доступ к имени и шести словам или к моему файлу, чем это грозит мне, моей бригаде и вам?',
    answers: [
      'Если посторонний доберётся до твоего логина и шести слов, он сможет перевыпустить конфиг бригадира. Старый конфиг тут же отключится, и ты останешься без бригады.',
      'Пользователи, которых ты добавил(-а), могут быть удалены. Теоретически можно по IP-адресу определить, кто они, «обогатив» эти данные у провайдеров. Но трафик чужак всё равно не увидит.',
      'Для нас риска никакого.',
    ]
  },
  {
    question: 'Что делать, если я забыл\\потерял 6 волшебных слов и\\или имя бригадира? Что будет с моими пользователями?',
    answers: [
      'Если ты тут и читаешь это — значит, имя твоего пользователя красуется в первой карточке списка.',
      'А вот 6 волшебных слов не восстановит никто, даже если приставить пистолет к виску щенка технического директора.',
      'Так что рулить бригадой ты сможешь, пока не потеряешь файл конфигурации. В поддержку можно обращаться, используя имя бригадира.',
      'Но если файл улетучится — бригада останется на произвол судьбы, и помочь тем, кому ты раздал(-а) конфиги, будет невозможно.',
      'Мы советуем перевыпустить бригаду и раздать ключи заново. Но мы ж тебе не начальники — выбор за тобой :)',
    ]
  },
]);

const cardColumns = ref([[], []]);

const windowWidth = ref(window.innerWidth);

const distributeCards = () => {
  cardColumns.value = [[], []];

  cardsList.value.forEach((card, index) => {
    cardColumns.value[index % 2].push(card);
  });
};

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  distributeCards();
};

onMounted(() => {
  distributeCards();
  window.addEventListener('resize', handleResize);
});

watchEffect(() => {
  distributeCards();
  if (props.isShown) {
    expandedQuestionIndex.value = null;
  }

});

const setExpandedQuestionIndex = (index) => {
  expandedQuestionIndex.value = expandedQuestionIndex.value === index ? null : index;
}

const isOpen = ref(false);

const toggleContent = () => {
  isOpen.value = !isOpen.value;
}
</script>

