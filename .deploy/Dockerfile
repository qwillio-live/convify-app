FROM node:20-alpine

# Install necessary dependencies for Chromium
RUN apk add --no-cache \
    chromium \
    udev \
    freetype \
    fontconfig \
    ttf-freefont \
    libxrender \
    libx11 \
    libxi \
    libxcomposite \
    libxcursor \
    libxtst \
    libxrandr \
    nss \
    alsa-lib \
    at-spi2-atk \
    cups \
    libpng

# Create destination directory
RUN mkdir -p /usr/src/convify-app && chmod -R 777 /usr/src/convify-app
WORKDIR /usr/src/convify-app

# Install app dependencies
COPY package.json pnpm-lock.yaml yarn.lock ./

# Copy the prisma schema file
COPY prisma/schema.prisma prisma/schema.prisma

# Install application dependencies
RUN yarn install

# Copy all the files in our project
COPY . .

# Build the Next.js application
RUN NODE_OPTIONS=--max_old_space_size=1024 yarn run postinstall
RUN yarn run build

# Set the environment variable for Puppeteer
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

EXPOSE 3000

# Start app
CMD ["yarn", "start"]
