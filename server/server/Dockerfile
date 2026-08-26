FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY mern-demo/server ./server
COPY mern-demo/models ./models

CMD ["node", "server/server.js"]
