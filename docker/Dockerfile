FROM node:20.15.1 as builder

WORKDIR /var/project

COPY . .

RUN npm install
#RUN yarn
RUN yarn run build:staging




FROM nginx:alpine
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY  --from=builder /var/project/dist/ /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
