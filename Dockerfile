FROM nginx:alpine
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY public /usr/share/nginx/html