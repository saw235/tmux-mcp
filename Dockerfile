FROM node:20-slim

# Install tmux and basic tools
RUN apt-get update && apt-get install -y \
    tmux \
    && rm -rf /var/lib/apt/lists/*

# Create tmux configuration directory
RUN mkdir -p /root/.tmux

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Create a basic tmux configuration
RUN echo "set -g history-limit 50000" > /root/.tmux.conf && \
    echo "set -g mouse on" >> /root/.tmux.conf

# Create a startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose the API port
EXPOSE 3000

# Start tmux server and the Node.js app
CMD ["/start.sh"]