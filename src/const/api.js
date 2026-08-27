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
  const keydeskPro = import.meta.env.VITE_KEYDESK_PRO_URL || '';
  const params = new URLSearchParams(search);
  const useVip = params.get('vip') === 'true';
  const usePro = params.get('pro') === 'true';

  isDevOrStageHost = onDevHost && Boolean(keydesk);
  apiLink = isDevOrStageHost ? (usePro ? (keydeskPro || keydesk) : useVip ? keydeskVip : keydesk) : '';
}

export { apiLink, isDevOrStageHost };
