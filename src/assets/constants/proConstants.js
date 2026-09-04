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

export const PRO_PROTOCOLS = ['vless', 'outline', 'gate19'];

export const PRO_FORMATS = ['link', 'key'];

export const TERM_MONTHS = [1, 3, 6, 12];

export const PRO_LIMITS = {
  name: 60,
  note: 400,
  sold: 7,
};

// Порог «истекает» в днях (совпадает с макетом).
export const WARN_DAYS = 7;
