/**
 * Стикеры ачивок и реакций: <id>.<ru|en>.webp (подпись вшита в картинку, поэтому
 * по файлу на язык). Пока настоящих стикеров нет - SVG-заглушки с той же
 * подписью; настоящий WebP с таким же именем автоматически выигрывает у SVG.
 */
const files = import.meta.glob('./*.{webp,svg}', {eager: true, import: 'default'});

export function stickerFor(id, locale) {
  const candidates = [
    `./${id}.${locale}.webp`,
    `./${id}.${locale}.svg`,
    `./${id}.ru.webp`,
    `./${id}.ru.svg`,
  ];
  const hit = candidates.find((name) => files[name]);
  return hit ? files[hit] : '';
}
