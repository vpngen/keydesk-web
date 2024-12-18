<template>
	<div class="profile__show-more-container">
    <div class="profile__show-more-column profile__show-more-column--mobile">
      <ShowMoreItem
        v-for="(card, index) in cardsList"
        :key="index"
        :title="card.question"
        :extraContent="card.answers"
        :isExpanded="expandedQuestionIndex===index"
        @setExpandedQuestionIndex = setExpandedQuestionIndex(index);
      />
    </div>
	</div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import ShowMoreItem from "@/components/ShowMoreItem.vue";

const props = defineProps({
    title: {
		type: String,
		required: false,
	},
    isShown: { type: Boolean }
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
            'На каждого пользователя по 100ГБ. Обнуление лимитов происходит в начале каждого месяца',
            '',
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
            'В текущей реализации – нет и это не наш основной приоритет. Для этого есть платные сервисы.',
        ]
    },
    {
        question: 'А если кто-то получит доступ к имени и шести словам или к моему файлу, чем это грозит мне, моей бригаде и вам?',
        answers: [
            'Если посторонний человек получит доступ к твоему логину и шести словам, то он сможет перевыпустить конфиг бригадира, соответственно предыдущий конфиг выключится. И ты останешься без бригады.',
            'Старые пользователи могут быть удалены, и можно будет по айпишнику определить, кто они, обогатив данные IP-адреса данными провайдеров, но трафик посторонний человек не увидит.',
            'Нам это ничем особо не грозит.',
        ]
    },
    {
        question: 'Что делать, если я забыл\\потерял 6 волшебных слов и\\или имя бригадира? Что будет с моими пользователями?',
        answers: [
            'Если ты тут и читаешь это, то имя твоего пользователя написано в первой карточке в списке пользователей. А вот 6 волшебных слов восстановить невозможно даже если ты приставишь пистолет к голове щенка технического директора проекта.',
            'Поэтому ты сможешь управлять бригадой пока не потеряешь файл конфигурации. И сможешь обращаться в поддержку используя имя бригадира.',
            'Но после потери файла бригада будет брошена на произвол судьбы и ты никак не сможешь помочь тем, кому раздал(-а) конфиги.',
            'Мы советуем перевыпустить бригаду и раздать ключи по новой. Но мы тебе не начальники, так что выбор твой:)',
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
    if(props.isShown) {
        expandedQuestionIndex.value = null;
    };
});

const setExpandedQuestionIndex = (index) => {
    expandedQuestionIndex.value = expandedQuestionIndex.value === index ? null : index;
}

const isOpen = ref(false);

const toggleContent = () => {
    isOpen.value = !isOpen.value;
}
</script>

