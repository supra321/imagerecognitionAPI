FROM node:12.16.3

RUN npm i nodemon -g

WORKDIR /usr/src/imagerecognitionAPI

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]