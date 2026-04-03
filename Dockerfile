# Use lightweight Node.js image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the app
COPY . .

# Cloud Run requires port 8080
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["npm", "start"]