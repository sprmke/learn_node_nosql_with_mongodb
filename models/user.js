const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      (cp) => cp.productId.toString() === product._id.toString()
    );

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      // increase quantity if cart product already exist
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      // add cart product to the cart items
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    // get cart product ids from user
    const productIds = this.cart.items.map((cart) => cart.productId);

    return (
      db
        .collection('products')
        // get all the product items which have these product ids
        .find({ _id: { $in: productIds } })
        .toArray()
        .then((products) => {
          // restructure products item with product data + total quantity
          return products.map((product) => {
            // get cart product quantity
            const { quantity } = this.cart.items.find(
              (cartItem) =>
                cartItem.productId.toString() === product._id.toString()
            );

            return {
              ...product,
              quantity,
            };
          });
        })
        .catch((ererrorr) => console.log(error))
    );
  }

  deleteItemFromCart(productId) {
    const db = getDb();

    const updatedCartItems = this.cart.items.filter(
      (cartItem) => cartItem.productId.toString() !== productId
    );

    console.log('updatedCart::', updatedCart);

    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      )
      .then((result) => console.log('Deleted'))
      .catch((error) => console.log(error));
  }

  addOrder() {
    const db = getDb();

    // get cart products data
    return this.getCart()
      .then((products) => {
        // order data structure must contain
        // all the cart products data and user information
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
          },
        };

        return (
          db
            .collection('orders')
            // add cart data to orders collection
            .insertOne(order)
        );
      })
      .then((result) => {
        // empty cart items on user collection
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users').findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
