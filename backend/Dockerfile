FROM node:20     
#Use a Linux container that already has Node.js v20 installed

WORKDIR /app
#All code will live here

COPY package*.json ./
#Copies package.json into the container.

RUN npm install
#All node packages get installed

COPY . .
#Docker copies all backend files into /app

EXPOSE 3000
#Use a Linux container that already has Node.js v20 installed.

CMD ["node", "src/server.js"]
#It will start your backend