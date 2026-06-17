FROM node

ENV MONGO_DB_USERNAME=root \
    MONGO_DB_PASSWORD=password

RUN mkdir -p testNodeApp

COPY . /testNodeApp

CMD ["node","/testNodeApp/server.js"]