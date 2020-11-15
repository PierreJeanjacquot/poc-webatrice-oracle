
FROM node:14-alpine as build
RUN apk update && apk upgrade
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build --production

FROM nginx:1.19.2-alpine as production
COPY spa.conf /etc/nginx/conf.d/default.conf
WORKDIR /app
COPY --from=build /build .
COPY --from=build /package.json .
