# Use Node.js 20
FROM node:20

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 5000

# Install PM2
RUN yarn global add pm2

# Start backend with PM2
CMD ["pm2-runtime", "src/index.js"]
