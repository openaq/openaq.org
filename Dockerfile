FROM node:10-stretch

WORKDIR /src

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm", "run" ]
CMD ["serve"]
