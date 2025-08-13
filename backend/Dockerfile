FROM node:23-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci

# RUN npm rebuild bcrypt --build-from-source

COPY src ./src
COPY server.ts ./
COPY swagger.yaml ./

EXPOSE 3000

CMD [ "npx", "ts-node", "server.ts" ]