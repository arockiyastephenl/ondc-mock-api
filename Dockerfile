FROM node:14

RUN mkdir -p /app
WORKDIR /app

COPY . .
RUN npm install

EXPOSE 8080

CMD ["npm", "start"]