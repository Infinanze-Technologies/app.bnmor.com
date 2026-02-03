FROM node:16-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json .
COPY yarn.lock .
RUN yarn install

# Copying source file
COPY . .

# Building app
EXPOSE 3000

# Runnung the app
CMD ["yarn","dev"]