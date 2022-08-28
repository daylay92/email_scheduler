FROM node:16-alpine3.11

RUN apk update && apk add curl bash make && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn run build

EXPOSE 4500

CMD ["yarn", "start"]
