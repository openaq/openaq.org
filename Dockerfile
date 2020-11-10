FROM node:10-slim

RUN apt-get update && apt-get install -y git python build-essential

WORKDIR /src

COPY package*.json ./

RUN npm ci

FROM node:10-slim

WORKDIR /src

COPY --from=0 /src/node_modules ./node_modules

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm", "run" ]
CMD ["serve"]
