FROM node:8.11.2-alpine

WORKDIR /gui

COPY package.json .
RUN npm install --quiet

COPY . .

EXPOSE 3000
