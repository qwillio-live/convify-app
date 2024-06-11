FROM node:20-alpine

# create destination directory
RUN mkdir -p /usr/src/convify-app && chmod -R 777 /usr/src/convify-app
WORKDIR /usr/src/convify-app

# install app dependencies
# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml yarn.lock ./
# Install pnpm globally
RUN npm install -g yarn

# Install application dependencies
RUN yarn install

#RUN npm install --force

# Copying all the files in our project
COPY . .

#RUN NODE_OPTIONS=--max_old_space_size=1024 npm run build
RUN NODE_OPTIONS=--max_old_space_size=1024 yarn run postinstall


# Build the Next.js application
RUN yarn run build

EXPOSE 3000

# start app
CMD [ "yarn", "start" ]