let apiLink = "";
if (process.env.NODE_ENV === "development") {
  const urlParams = new URLSearchParams(window.location.search);
  const useVip = urlParams.get('vip') === 'true';

  if (useVip) {
    apiLink = "https://keydesk-vip.ussr.vpngen.org";
  } else {
    apiLink = "https://keydesk.ussr.vpngen.org";
  }
}

export {apiLink};
