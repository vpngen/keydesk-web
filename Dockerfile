# syntax=docker/dockerfile:1
# https://cli.vuejs.org/guide/deployment.html#docker-nginx
# Node >= 16 (vue-i18n@9, Vue CLI 5). При отсутствии тега в registry — зеркалируйте node:18.20.4-bullseye.
FROM cr.yandex/crprnotkh7r44umnfrio/node:18.20.4-bullseye AS build
COPY . /src
RUN cd /src && \
	yarn install && \
	yarn build --mode development


FROM cr.yandex/crprnotkh7r44umnfrio/nginx:1.27-alpine3.19-slim
ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 8080
STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /src/dist /app


