# syntax=docker/dockerfile:1
# https://cli.vuejs.org/guide/deployment.html#docker-nginx
FROM cr.yandex/crprnotkh7r44umnfrio/node:14.19.3-buster AS build
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


