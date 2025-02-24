export default {
		header: {
			link: [
				{text: 'Как это работает', href: '#generator'},
				{text: 'Полная реализация', href: '#realisation'},
				{text: 'Нас поддерживают', href: '#support'},
				{text: 'Пресса о нас', href: '#about'},
				{text: 'Об университете', href: ''},
			],
			button: 'Support us',
		},
		headerInset: {
			link: [
				{text: 'Connections', href: ''},
				{text: 'What data we collect?', href: ''},
				{text: 'Contact us', href: ''},
				{text: 'Problem?', href: ''},
			],
			langList: [
				{
					lang: 'German',
					img: 'de',
					href: '#'
				},
				{
					lang: 'English',
					img: 'en',
					href: '#'
				},
				{
					lang: 'Russian',
					img: 'ru',
					href: '#'
				},
			],
		},
		intro: {
			title: 'Кто такой Неуловимый&nbsp;Джо?',
			text: 'И&nbsp;мы&nbsp;не&nbsp;знаем. Поэтому он&nbsp;и&nbsp;неуловимый. На&nbsp;этом принципе построено решение, которое позволит нам пройти под радарами централизованных блокировок РКН.',
			button: 'Поддержите нас',
		},
		generator: {
			title: 'VPN Generator',
			text: [
				'Почему РКН может заблокировать любой VPN? Потому что у&nbsp;кажого VPN есть единая точка входа к&nbsp;которой подключаются пользователи.',
				'Что если этих точек будет так много и&nbsp;они будут такими незаметными, что найти их&nbsp;все невозможно, и&nbsp;очень затратно для бюрократической машины?',
			],
			card: [
				'Мы даем человеку готовый VPN',
				'Он приглашает своих друзей и семью',
				'Каждый получает файл конфигурации',
				'Все пользуются свободным интернетом',
				'Цель MVP:<br>100 000 человек, подключенных через 1000 маленьких VPN-ов',
			],
		},
		realisation: {
			title: 'Полная реализация',
			text: 'В&nbsp;России сейчас 100&nbsp;млн. пользователей интернета, из&nbsp;них VPN пользуются 20%. Нам хочется сделать так, чтобы эта цифра превысила 50%. Для этого нужно сделать продукт',
			card: [
				{
					title: 'Еще проще',
					text: '50% пользователей должны быть способны администрировать VPN, а&nbsp;95%&nbsp;&mdash; им&nbsp;пользоваться',
				},
				{
					title: 'Еще быстрее',
					text: 'Довевсти скорость VPN до&nbsp;уровня просмотра видео в&nbsp;FullHD',
				},
				{
					title: 'Еще доступнее',
					text: 'Продвигать VPN Generator там, где не&nbsp;ступала нога либерала',
				},
			],
			vignette: '30&nbsp;000&nbsp;000&nbsp;человек, подключенные к&nbsp;300&nbsp;000 маленьких VPNчиков',
		},
		helper: {
			title: 'Нам нужна ваша помощь',
			text: 'Мы&nbsp;создаем сервис, который позволит любому активному пользователю интернета раздать бесплатный доступ к&nbsp;интернету без цензуры и&nbsp;блокировок своим друзьям и&nbsp;близким.',
			form: {
				input: [
					{
						name: 'name',
						placeholder: 'Имя',
					},
					{
						name: 'company',
						placeholder: 'Компания',
					},
					{
						name: 'phone',
						placeholder: 'Телефон',
					},
				],
				accept: 'Согласен с&nbsp;<a href="#" target="_blank">условиями</a>&nbsp;обработки персональных данных',
				button: 'Поддержите нас',
			},
		},
		support: {
			title: 'Нас поддерживают',
		},
		generator2: {
			title: 'VPN Generator - проект&nbsp;IEDN',
			text: [
				'Институт занимается распространением знаний о&nbsp;структуре и&nbsp;приципах работы интернета и&nbsp;поддержкой проектов, направленных на&nbsp;его развитие',
			],
		},
		about: {
			title: 'Пресса о нас',
			text: 'Мы классные, поэтому о нас уже написали Washington Post, Wiered, NY Times, Die Welt, Deutsche Welle  и другие',
		},
		footer: {
			link: ['Impessum', 'Datenschutz'],
			copyright: '&copy;&nbsp;2022&nbsp;IEDN',
		},
		profile: {
			headline: {
				title: 'Привет, ',
				search: 'Поиск',
				button: 'Добавить',
			},
			title: 'Сбор данных',
		},
		dataCollection: [
			{
				type: 'Исходный IP-адрес',
				user: '10 недель',
				brigadier: '10 недель',
			},
			{
				type: 'IP-адреса посещенных сайтов',
				user: '10 недель',
				brigadier: '10 недель',
			},
			{
				type: 'ID в Телеграм',
				user: '',
				brigadier: 'При обращении в поддержку на 1 неделю, при обращении для получения конфига бригадира на 2 дня и навечно при бане пользователя.',
			},
			{
				type: 'Cookies',
				user: '',
				brigadier: 'Cookies для работы ключницы внутри VPN-соединения',
			},
			{
				type: 'Номер телефона',
				user: '',
				brigadier: '',
			},
			{
				type: 'URL посещенных сайтов',
				user: '',
				brigadier: '',
			},
			{
				type: 'Данные о местоположении',
				user: '',
				brigadier: '',
			},
		],
		notifications: {
			title: 'Сообщения ',
			card: [
				{
					impotant: true,
					title: 'Заголовок нотификейшена',
					text: 'Porta consequat pellentesque maecenas lobortis rhoncus a. Mollis habitasse iaculis purus sit lorem. Suscipit porttitor sed amet leo malesuada. Urna eu quis lorem facilisi dui rhoncus.',
				},
				{
					title: 'Заголовок нотификейшена',
					text: 'Porta consequat pellentesque maecenas lobortis rhoncus a. Mollis habitasse iaculis purus sit lorem. Suscipit porttitor sed amet leo malesuada. Urna eu quis lorem facilisi dui rhoncus.',
				},
				{
					title: 'Заголовок нотификейшена',
					text: 'Porta consequat pellentesque maecenas lobortis rhoncus a. Mollis habitasse iaculis purus sit lorem. Suscipit porttitor sed amet leo malesuada. Urna eu quis lorem facilisi dui rhoncus.',
				},
				{
					title: 'Заголовок нотификейшена',
					text: 'Porta consequat pellentesque maecenas lobortis rhoncus a. Mollis habitasse iaculis purus sit lorem. Suscipit porttitor sed amet leo malesuada. Urna eu quis lorem facilisi dui rhoncus.',
				},
				{
					title: 'Заголовок нотификейшена',
					text: 'Porta consequat pellentesque maecenas lobortis rhoncus a. Mollis habitasse iaculis purus sit lorem. Suscipit porttitor sed amet leo malesuada. Urna eu quis lorem facilisi dui rhoncus.',
				},
				{
					hide: true,
					title: 'Заголовок нотификейшена',
					text: 'Porta consequat pellentesque maecenas lobortis rhoncus a. Mollis habitasse iaculis purus sit lorem. Suscipit porttitor sed amet leo malesuada. Urna eu quis lorem facilisi dui rhoncus.',
				},
			],
		},
	};
