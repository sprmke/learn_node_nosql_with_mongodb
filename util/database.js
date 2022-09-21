const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  const { MONGODB_CONNECTION_STRING = '' } = process.env;

  MongoClient.connect(MONGODB_CONNECTION_STRING)
    .then((client) => {
      console.log('Connected!');
      _db = client.db(); // store connection to local variable
      callback();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

// get database connection instance
// to be used on different places of our app
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
