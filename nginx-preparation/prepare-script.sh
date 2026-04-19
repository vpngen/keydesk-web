#!/bin/bash
set -e

REMOTE_USER="deployment.automation"
REMOTE_HOST="${HOSTNAME}"
APP_FQDN="${APP_FQDN}"

LOCAL_TMP_CONF="/tmp/${APP_FQDN}.conf"
REMOTE_CONF_PATH="/etc/nginx/sites-enabled/${APP_FQDN}.conf"

LOCAL_TMP_WWW_CONF="/tmp/www.${APP_FQDN}.conf"
LOCAL_TMP_REDIRECT_WWW_CONF="/tmp/redirect.${APP_FQDN}.conf"
REMOTE_WWW_CONF_PATH="/etc/nginx/sites-enabled/www.${APP_FQDN}.conf"

cat > "$LOCAL_TMP_CONF" <<EOF
server {
    listen 80;
    server_name $APP_FQDN;

    client_max_body_size    10m;
    client_body_buffer_size 128k;

    location / {
        proxy_pass  http://127.0.0.1:$APP_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

cat > "$LOCAL_TMP_WWW_CONF" <<EOF
server {
    listen 80;
    server_name www.$APP_FQDN;

    client_max_body_size    10m;
    client_body_buffer_size 128k;

    location / {
        proxy_pass  http://127.0.0.1:$APP_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

cat > "$LOCAL_TMP_REDIRECT_WWW_CONF" <<EOF
server {
    listen 80;
    server_name server_name www.$APP_FQDN;
    return 301 https://$APP_FQDN\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.$APP_FQDN;

    ssl_certificate     /etc/letsencrypt/live/www.$APP_FQDN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.$APP_FQDN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://$APP_FQDN$request_uri;
}
EOF

echo "Copy confix on server..."
scp "$LOCAL_TMP_CONF" "${REMOTE_USER}@${REMOTE_HOST}:/tmp/${APP_FQDN}.conf"
scp "$LOCAL_TMP_WWW_CONF" "${REMOTE_USER}@${REMOTE_HOST}:/tmp/www.${APP_FQDN}.conf"
scp "$LOCAL_TMP_REDIRECT_WWW_CONF" "${REMOTE_USER}@${REMOTE_HOST}:/tmp/redirect.${APP_FQDN}.conf"


echo "Configuring nginx on remote server..."
ssh "${REMOTE_USER}@${REMOTE_HOST}" bash <<EOF
  set -e

  if [ -f "$REMOTE_CONF_PATH" ]; then
      echo "File name: $REMOTE_CONF_PATH exist — skipped."
  else
      sudo mv "/tmp/${APP_FQDN}.conf" "$REMOTE_CONF_PATH"
      sudo nginx -t
      sudo systemctl reload nginx
      echo "Запуск Certbot для $APP_FQDN"
      sudo certbot --nginx --non-interactive --agree-tos \
      --email evgeniy.slobodeniuk@beeonline.pro \
      -d "$APP_FQDN"
  fi
  
EOF

ssh "${REMOTE_USER}@${REMOTE_HOST}" bash <<EOF
  set -e

  if [ -f "$REMOTE_WWW_CONF_PATH" ]; then
      echo "File name: $REMOTE_WWW_CONF_PATH exist — skipped."
  else
      sudo mv "/tmp/www.${APP_FQDN}.conf" "$REMOTE_WWW_CONF_PATH"
      sudo nginx -t
      sudo systemctl reload nginx
      echo "Запуск Certbot для www.$APP_FQDN"
      sudo certbot --nginx --non-interactive --agree-tos \
      --email evgeniy.slobodeniuk@beeonline.pro \
      -d "www.$APP_FQDN"
      sudo mv "/tmp/redirect.${APP_FQDN}.conf" "$REMOTE_WWW_CONF_PATH"
      sudo nginx -t
      sudo systemctl reload nginx
  fi
  
EOF