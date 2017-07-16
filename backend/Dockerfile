FROM node:8.1.2
RUN mkdir -p /backend
WORKDIR /backend
COPY . /backend
RUN yarn install
EXPOSE 4000
CMD ["yarn", "start"]
