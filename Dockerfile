FROM node:20-bookworm-slim
WORKDIR /app
COPY package.json .
COPY client/package*.json ./client/
COPY server/package*.json ./server/
RUN cd client && npm install && cd ../server && npm install
COPY . .
RUN cd client && npm run build
EXPOSE 8080
CMD ["npm", "run", "start", "--workspace", "server"]
