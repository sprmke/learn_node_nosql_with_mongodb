const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');

const errorController = require('./controllers/error');
const User = require('./models/user');

const { mongoConnect } = require('./util/database');

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // Temporary do this:
  // to save this userId on products collection
  User.findById('632bef750415689a6e4bbf06')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
