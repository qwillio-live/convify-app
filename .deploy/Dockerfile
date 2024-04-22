FROM node:16.16.0-alpine

# create destination directory
RUN mkdir -p /usr/src/convify-app
WORKDIR /usr/src/convify-app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# Copying all the files in our project
COPY . .

RUN NODE_OPTIONS=--max_old_space_size=1024 npm run build

# Build the Next.js application
RUN npm run build

EXPOSE 3000

# start app
CMD [ "npm", "start" ]