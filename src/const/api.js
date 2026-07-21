let apiLink = '';
let isDevOrStageHost = false;

if (import.meta.env.MODE !== 'production') {
  const {hostname, search} = window.location;
  const onDevHost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.dev.beeonline.pro');

  const keydesk = import.meta.env.VITE_KEYDESK_URL || '';
  const keydeskVip = import.meta.env.VITE_KEYDESK_VIP_URL || '';
  const useVip = new URLSearchParams(search).get('vip') === 'true';

  isDevOrStageHost = onDevHost && Boolean(keydesk);
  apiLink = isDevOrStageHost ? (useVip ? keydeskVip : keydesk) : '';
}

export { apiLink, isDevOrStageHost };
