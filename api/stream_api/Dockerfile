FROM node:lts-slim

WORKDIR /app

COPY ./app/package-lock.json ./app/package.json ./app/.env ./app/src /app/

RUN npm install && mkdir -p app/Repositories

CMD [ "npm", "start" ]