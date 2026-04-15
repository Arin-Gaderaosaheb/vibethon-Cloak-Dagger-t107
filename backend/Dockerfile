FROM node:20-alpine
WORKDIR /app

# Install Python 3 for the Playground feature
RUN apk add --no-cache python3

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000
CMD ["node", "src/server.js"]
