// Справочники PRO-интерфейса. Дизайн фиксирует два платных тарифа (Basic/Unlim);
// бэкенд пока знает только единый 'pro' — при деградации до одного тарифа
// правится только этот файл и локали.

export const PRO_TIERS = ['free', 'basic', 'unlim'];

export const TIER_PRICE = {
  free: 0,
  basic: 2,
  unlim: 5,
};

export const PRO_STATUSES = ['ok', 'warn', 'blocked', 'off', 'idle'];

export const BILLING_STATES = ['paid', 'issued', 'overdue', 'suspended'];

// Временно: в этом месяце инвойсов нет (покупка ключей идёт напрямую с карты),
// баннер подписки показывает «оплачено» и не раскрывается. Включим вместе
// с возвратом раздела «Инвойсы».
export const PRO_INVOICES_ENABLED = false;

export const PRO_PROTOCOLS = ['vless', 'outline', 'gate19'];

export const PRO_FORMATS = ['link', 'key'];

export const PRO_LIMITS = {
  name: 60,
  note: 400,
  sold: 7,
};

// Порог «истекает» в днях (совпадает с макетом).
export const WARN_DAYS = 7;

// Неактивность для аналитики: был вход, но 30+ дней назад.
export const INACTIVE_DAYS = 30;

// Месячная квота Pro Basic (ГБ) - по ней считаем расход из остатка квоты keydesk.
export const BASIC_QUOTA_GB = 100;
