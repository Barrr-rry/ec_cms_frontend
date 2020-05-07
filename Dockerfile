# production stage
FROM nginx:stable-alpine as production-stage
WORKDIR /app
COPY . .
COPY dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]