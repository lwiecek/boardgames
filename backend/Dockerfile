FROM node:8.1.2
RUN mkdir -p /backend
WORKDIR /backend
COPY package.json /backend
COPY yarn.lock /backend
RUN yarn install
COPY . /backend
EXPOSE 4000
CMD ["yarn", "start"]
