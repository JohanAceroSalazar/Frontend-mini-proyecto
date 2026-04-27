FROM node:20-alpine

WORKDIR /app

COPY server.js ./
COPY src ./src

EXPOSE 5500

CMD ["node", "server.js"]
