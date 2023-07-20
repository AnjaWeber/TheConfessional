#
# Build stage
#
FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

#
# "prod" stage
#
FROM node:18 AS prod

ENV HTTP_PORT=3000

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci && \
  npm cache clean --force

COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
