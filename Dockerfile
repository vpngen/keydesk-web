# syntax=docker/dockerfile:1

FROM node:14.19.3-buster AS build
COPY . /src
RUN cd /src && \
	yarn install && \
	yarn build --mode development


FROM nginx:1.22.1-alpine
ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 8080
STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /var/www/html


