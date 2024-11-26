FROM node:20

WORKDIR /usr/src/app 

COPY donate_dish/package*.json ./ 
COPY donate_dish/tsconfig.json ./ 
COPY donate_dish/libs ./libs/ 
COPY donate_dish/nest-cli.json ./
COPY donate_dish/tsconfig.build.json ./


RUN npm install

COPY donate_dish/apps/dish ./apps/dish/

RUN npm run build dish 

CMD ["node", "dist/apps/dish/main"]