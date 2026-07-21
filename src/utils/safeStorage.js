/**
 * Безопасные обёртки над localStorage. Safari в приватном режиме и пользовательские
 * настройки могут бросать на любых операциях — не даём исключению развалить флоу.
 */
export function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}
