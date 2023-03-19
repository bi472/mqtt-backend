FROM node:18

RUN npm i -g @nestjs/cli

COPY package.json .

RUN npm install --force

COPY . .

EXPOSE 3000

CMD ["nest", "start"]