/**
 * Country looks of the regular keydesk layout.
 *
 * The keydesk token carries the brigade's `country` claim (brigade.json
 * `country`, set with the `country` SSH verb; "ru" or absent is the default
 * look). A country with an entry here replaces the regular, VIP and PRO
 * appearance; anything else leaves them untouched.
 *
 * `chart` feeds ChartLine.vue (every field is optional and falls back to the
 * regular colours), `defaultSort` is the sorting the Figma shows on first open.
 * The SCSS lives in assets/scss/themes/_<code>.scss, the card markup in
 * components/theme/, and the text overlay in public/locales/themes/<code>.<locale>.json.
 */
export const DEFAULT_COUNTRY = 'ru';

export const COUNTRY_THEMES = {
  kg: {
    className: 'theme-kg',
    defaultSort: 'nameAsc',
    chart: {
      line: '#7ccbeb',
      lineWidth: 2,
      point: '#e8c27a',
      pointBackground: '#1b2230',
      area: 'rgba(232, 194, 122, 0.22)',
      grid: 'rgba(255, 255, 255, 0.12)',
      tick: '#c9d3dc',
      tooltipBackground: '#171d25',
      tooltipText: '#f2f5f7',
    },
  },
};

export const THEME_LOCALES = ['ru', 'en'];

/** Theme name for a country claim, or '' for the default look. */
export function themeForCountry(country) {
  const code = String(country || '').toLowerCase();
  return code !== DEFAULT_COUNTRY && COUNTRY_THEMES[code] ? code : '';
}
