#Each instruction in this file creates a new layer
#Here we are getting our node as Base image
# FROM node:latest
FROM node:12.16.1

ENV NODE_ENV=production

#Creating a new directory for app files and setting path in the container
RUN mkdir -p /usr/src/app

#setting working directory in the container
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# installing the dependencies into the container
# RUN npm install
RUN npm install --production

# copy all the files to the container
COPY . .

EXPOSE 3300
CMD [ "node", "server.js" ]