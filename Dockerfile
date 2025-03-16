FROM node:18 AS builder
WORKDIR /app

# Copy frontend code and install dependencies
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm install

# Build the frontend
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
COPY frontend ./frontend
RUN cd frontend && npm run build

# Stage 2: Setup the backend
FROM node:18
WORKDIR /app

# Copy backend dependencies and install them
COPY backend/package.json backend/package-lock.json ./
RUN npm install

# Copy backend code and built frontend
COPY backend ./backend
COPY --from=builder /app/frontend/build ./backend/public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Start the backend
CMD [ "node", "backend/server.js" ]
