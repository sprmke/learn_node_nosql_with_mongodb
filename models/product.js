const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // Update product
      dbOp = db
        .collection('products')
        .updateOne({ _id: new ObjectId(this._id) }, { $set: this });
    } else {
      // Create new product
      dbOp = db.collection('products').insertOne(this);
    }

    return dbOp
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((error) => console.log(error));
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection('products')
      .find({
        _id: new ObjectId(productId),
      })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((error) => console.log(error));
  }

  static deleteById(productId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new ObjectId(productId) })
      .then((result) => console.log('Deleted'))
      .catch((error) => console.log(error));
  }
}

module.exports = Product;
