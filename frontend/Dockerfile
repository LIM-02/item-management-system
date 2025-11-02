# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development \
    NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache bash

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]

EXPOSE 3000

CMD ["npm", "run", "dev"]
