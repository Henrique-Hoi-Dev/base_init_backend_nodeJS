# hadolint ignore=DL3006
FROM node:20.12.2-alpine AS build

ENV TZ=America/Sao_Paulo

WORKDIR /usr/app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev --silent

COPY . .

# hadolint ignore=DL3006
FROM node:20.12.2-alpine

ENV TZ=America/Sao_Paulo \
    NODE_ENV=production \
    PORT=3000

WORKDIR /usr/app/current

COPY --from=build /usr/app ./

EXPOSE 3000

CMD ["node", "server.js"]

########################################################################
# DEV NOTE                                                             #
# No docker-compose.yml montamos volume .:/usr/app/current             #
# – o código local sobrepõe e traz os devDependencies (nodemon, etc.)  #
# – então em dev você pode rodar: `npm install` no host e              #
#   `CMD ["nodemon", "server.js"]` se preferir                         #
########################################################################
