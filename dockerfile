FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN chown -R node:node .

USER node

EXPOSE 3000

CMD ["node", "app.js"]