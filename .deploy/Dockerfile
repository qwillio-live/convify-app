FROM node:20-alpine

# create destination directory
RUN mkdir -p /usr/src/convify-app && chmod -R 777 /usr/src/convify-app
WORKDIR /usr/src/convify-app

# install app dependencies
# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./
# Install pnpm globally
RUN npm install -g pnpm

# Install application dependencies
RUN pnpm install
RUN pnpx prisma migrate dev --name add-password-hash
RUN pnpx prisma generate

#RUN npm install --force

# Copying all the files in our project
COPY . .

#RUN NODE_OPTIONS=--max_old_space_size=1024 npm run build
RUN NODE_OPTIONS=--max_old_space_size=1024 pnpm run postinstall


# Build the Next.js application
RUN pnpm run build

EXPOSE 3000

# start app
CMD [ "pnpm", "start" ]