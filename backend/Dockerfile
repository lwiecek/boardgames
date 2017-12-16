FROM node:9
RUN mkdir -p /backend
WORKDIR /backend
COPY package.json /backend
COPY yarn.lock /backend
RUN yarn install
COPY . /backend
EXPOSE 4000 4444
CMD ["yarn", "start"]
