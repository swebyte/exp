FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose HTTP port
EXPOSE 3001

# Start the HTTP server (use 'npm run mcp' for MCP stdio server)
CMD ["npm", "start"]
