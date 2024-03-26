FROM node:16.10.0-alpine3.14 as builder

WORKDIR /code
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install && npm ci && npm run build

FROM node:16.10.0-alpine3.14

EXPOSE 3000

WORKDIR /code

COPY package.json ./
RUN npm install && npm ci

COPY --from=builder /code/dist ./dist

CMD [ "node", "/code/dist/main.js"]
