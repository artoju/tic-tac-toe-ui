# build stage
FROM node:lts-alpine as build-stage

WORKDIR /app
COPY package*.json ./
RUN npm rm -r node_modules
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
# Add nginx config
COPY .docker/nginx/server.conf /temp/server.conf
RUN envsubst /app < /temp/server.conf > /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
