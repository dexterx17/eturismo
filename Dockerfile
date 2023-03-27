FROM node:14

#aproach 1
#COPY . /usr/src/app
#WORKDIR /usr/src/app
#RUN npm install -g gulp
#RUN npm install

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
RUN npm install -g gulp
COPY . .
#RUN gulp

CMD "npm" "start"


#EXPOSE 3000

#CMD "echo" "hola"