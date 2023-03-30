
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
    "Status": 1,
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
    "Status": 4,
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
    "Status": 5,
}];

export const profileCardStatus = {
    statusName: {
        1: 'Всё отлично!',
        2: 'Мёртвая душа',
        3: 'Ёжик в тумане',
        4: 'Работает с ограничениями',
        5: 'Временная блокировка',
    },
    statusHint: {
        1: 'Этот пользователь просто наслаждается VPN и ничто не предвещает беды',
        2: 'Этот пользователь ни разу не подключился к VPN',
        3: 'Этот пользователь не подключился к VPN в этом месяце',
        4: 'Скорость этого пользователя снижена до 256 кб\\сек из-за превышения лимита трафика',
        5: 'Пользователь заблокирован на [оставшееся время] за [тип нарушения]',
    },
    statusColor: {
        1: 'status-green',
        2: 'status-black',
        3: 'status-gray',
        4: 'status-yellow',
        5: 'status-red',
    }
}