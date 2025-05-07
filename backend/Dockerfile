FROM node:22.15

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

EXPOSE 3001
CMD ["npm", "run", "start:dev"]