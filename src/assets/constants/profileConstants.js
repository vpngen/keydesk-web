export const mockedDataProfile = [{
    "MonthlyQuotaRemainingGB": 100,
    "LastVisitHour": '2023-03-21T11:00:00.000Z',
    "PersonDesc": "За открытие нейтрона",
    "PersonDescLink": "https://ru.wikipedia.org/wiki/%D0%A7%D0%B5%D0%B4%D0%B2%D0%B8%D0%BA,_%D0%94%D0%B6%D0%B5%D0%B9%D0%BC%D1%81",
    "PersonName": "Джеймс Чедвик",
    "Problems": true,
    "UserID": "1613927c-a3ba-433b-b102-499017503122",
    "UserName": "user",
    "ref": "firstUserProfileCard",
    "Status": 'green',
}, {
    "MonthlyQuotaRemainingGB": 100,
    "LastVisitHour": '2023-03-21T11:00:00.000Z',
    "PersonDesc": "За крупный вклад в дело разоружения. Роль: писатель, дипломат, член кабинета министров.",
    "PersonDescLink": "https://ru.wikipedia.org/wiki/%D0%9C%D1%8E%D1%80%D0%B4%D0%B0%D0%BB%D1%8C,_%D0%90%D0%BB%D1%8C%D0%B2%D0%B0",
    "PersonName": "Альва Мюрдаль",
    "Problems": null,
    "UserID": "4f90e7d1-64c6-4209-ae24-c2728d6e3b21",
    "UserName": "Умный Ильич Мечников",
    "ref": "secondUserProfileCard",
    "Status": 'yellow',
}, {
    "MonthlyQuotaRemainingGB": 100,
    "LastVisitHour": '2023-03-21T11:00:00.000Z',
    "PersonDesc": "В знак признания заслуг в деле мира. Роль: основательницы движения за мир в Северной Ирландии.",
    "PersonDescLink": "https://ru.wikipedia.org/wiki/%D0%A3%D0%B8%D0%BB%D1%8C%D1%8F%D0%BC%D1%81,_%D0%91%D0%B5%D1%82%D1%82%D0%B8",
    "PersonName": "Бетти Уильямс",
    "Problems": true,
    "UserID": "959e5242-daa8-4402-ac6a-0f2cf83c1e68",
    "UserName": "Разный Лев Давыдович",
    "ref": "thirdUserProfileCard",
    "Status": 'grey',
}];

export const sortingMap = {
    'nameAsc': 'nameAsc',
    'nameDesc': 'nameDesc',
    'dateAsc': 'dateAsc',
    'dateDesc': 'dateDesc',
};

export const sortingList = [
    {
        name: 'По алфавиту (возрастание)',
        label: sortingMap.nameAsc,
        textLabel: '(А-Я)',
    },
    {
        name: 'По алфавиту (убывание)',
        label: sortingMap.nameDesc,
        textLabel: '(Я-А)',
    },
    {
        name: 'По дате создания (возрастание)',
        label: sortingMap.dateAsc,
    },
    {
        name: 'По дате создания (убывание)',
        label: sortingMap.dateDesc,
    },
];

export const statusMap = {
    'all': 'all',
    'green': 'green',
    'black': 'black',
    'grey': 'grey',
    'yellow': 'yellow',
    'red': 'red',
};

export const profileCardStatus = {
    statusName: {
        [statusMap.green]: 'Всё отлично!',
        [statusMap.black]: 'Мёртвая душа',
        [statusMap.grey]: 'Ёжик в тумане',
        [statusMap.yellow]: 'Работает с ограничениями',
        [statusMap.red]: 'Редиска',
    },
    statusHint: {
        [statusMap.green]: 'Этот пользователь просто наслаждается VPN и ничто не предвещает беды',
        [statusMap.black]: 'Этот пользователь ни разу не подключился к VPN',
        [statusMap.grey]: 'Этот пользователь не подключился к VPN в этом месяце',
        [statusMap.yellow]: 'Скорость этого пользователя снижена до 256 кб\\сек из-за превышения лимита трафика',
        [statusMap.red]: 'Пользователь заблокирован',
    },
    statusColor: {
        [statusMap.green]: 'status-green',
        [statusMap.black]: 'status-black',
        [statusMap.grey]: 'status-grey',
        [statusMap.yellow]: 'status-yellow',
        [statusMap.red]: 'status-red',
    }
};

export const statusesList = [
    {
        name: 'Все статусы', label: statusMap.all,
    },
    {
        name: 'Все отлично!', label: statusMap.green,
    },
    {
        name: 'Мертвая душа', label: statusMap.black,
    },
    {
        name: 'Ежик в тумане', label: statusMap.grey,
    },
    {
        name: 'Работает с ограничениями', label: statusMap.yellow,
    },
    {
        name: 'Временная блокировка', label: statusMap.red,
    },
];

export const sortingMessageList = [
    {
        name: 'По приоритету (возрастание)',
        label: sortingMap.nameAsc,
        textLabel: '(0-10)',
    },
    {
        name: 'По приоритету (убывание)',
        label: sortingMap.nameDesc,
        textLabel: '(10-0)',
    },
    {
        name: 'По дате создания (возрастание)',
        label: sortingMap.dateAsc,
    },
    {
        name: 'По дате создания (убывание)',
        label: sortingMap.dateDesc,
    },
];

export const statusMessageList = [
    {
        name: 'Все статусы', label: statusMap.all,
    },
    {
        name: 'Важные', label: statusMap.red,
    },
    {
        name: 'Разные', label: statusMap.green,
    },
];

export const messageStatus = {
    statusName: {
        [statusMap.red]: 'Важные',
        [statusMap.green]: 'Разные',
    },
    statusColor: {
        [statusMap.red]: 'status-red',
        [statusMap.green]: 'status-green',
    }
};

export const profileDirectionsCards = {
    selectByDevice: [
        {
            label: 'Windows',
            image: 'windows',
            href: 'https://docs.google.com/document/d/1QsX0fNUW1XvlSAT2ZMHLC__iPXRTssyQEev4Udhz3hk/edit#heading=h.8qrc3gvqfvjz',
        },
        {
            label: 'MacOS',
            image: 'macos',
            href: 'https://docs.google.com/document/d/1QsX0fNUW1XvlSAT2ZMHLC__iPXRTssyQEev4Udhz3hk/edit#heading=h.29gd7ig16m2i',
        },
        {
            label: 'iOS',
            image: 'ios',
            href: 'https://docs.google.com/document/d/1QsX0fNUW1XvlSAT2ZMHLC__iPXRTssyQEev4Udhz3hk/edit#heading=h.c0l38dd4lv2l',
        },
        {
            label: 'Android',
            image: 'android',
            href: 'https://docs.google.com/document/d/1QsX0fNUW1XvlSAT2ZMHLC__iPXRTssyQEev4Udhz3hk/edit#heading=h.x8esnktg3dd6',
        },
        {
            label: '*nix',
            image: 'linux',
            href: 'https://docs.google.com/document/d/1QsX0fNUW1XvlSAT2ZMHLC__iPXRTssyQEev4Udhz3hk/edit#heading=h.ibx71rx6io83',
        },
    ],
    selectByProtocol: [
        {
            label: 'Outline',
            image: 'outline',
            href: 'https://docs.google.com/document/d/1QsX0fNUW1XvlSAT2ZMHLC__iPXRTssyQEev4Udhz3hk',
        },
        {
            label: 'Amnezia',
            image: 'amnezia',
            href: 'https://docs.google.com/document/d/1pEwntDJwM8fYQ5DGxTHGjjXmnQ_YYkxF2HCKywEeVa0/',
        },
    ]
};

export const labelsOnly = statusesList.map(item => item.label);
