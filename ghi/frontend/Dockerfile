FROM node:20.11.1

WORKDIR /ghi/frontend

COPY /public /public
COPY /src /src
COPY /package.json /package.json
RUN npm install

CMD npm run start