const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  const { MONGODB_CONNECTION_STRING = '' } = process.env;

  MongoClient.connect(MONGODB_CONNECTION_STRING)
    .then((client) => {
      console.log('Connected!');
      callback(client);
    })
    .catch((error) => console.log(error));
};

module.exports = mongoConnect;
