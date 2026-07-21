FROM cr.yandex/crprnotkh7r44umnfrio/node:20.19-bookworm AS build
ARG BUILD_MODE=development
COPY . /src
RUN cd /src && \
	npm ci && \
	npm run build -- --mode "$BUILD_MODE"


FROM cr.yandex/crprnotkh7r44umnfrio/nginx:1.27-alpine3.19-slim
ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 8080
STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /src/dist /app
