FROM node:16-alpine
WORKDIR /app

# Copy and install node_modules for caching
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
