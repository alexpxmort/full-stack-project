FROM node:16.14.0

WORKDIR /usr/src/app

COPY package.json ./
COPY ./back-api-nestjs/ ./back-api-nestjs/
COPY ./front-app/ ./front-app/
RUN  npm run setup

COPY . .

EXPOSE 3000 8080

RUN npm install -g concurrently

CMD ["concurrently", "npm:start:back", "npm:start:front"]


