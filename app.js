//MAIN LIBS
const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
const hbs = require('express-handlebars');

//INIT EXPRESS
const app = express();

//CONFIG KEYS
const db_key = require('./config/key');

//CONNECT TO MONGODB
mongoConnect(db_key.url);

//TEMPLATE ENGINE (HANDLEBARS)
app.engine(
  'hbs',
  hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`,
    helpers: {
      isDefined(value) {
        return typeof value != 'undefined' ? value : '';
      },
      displayErrors(errors) {
        return typeof errors != 'undefined';
      },
      displayAfterSuccess(success) {
        return success != '';
      },
      displayAfterError(error) {
        return error != '';
      },
      displayLoginError(error) {
        return error != '';
      }
    }
  })
);
app.set('view engine', 'hbs');

//BODY PARSER
app.use(express.urlencoded({ extended: false }));

//SESSION
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//CONNECT FLASH
app.use(flash());

//CUSTOM MIDDLEWARE
const global = require('./middleware/global');
app.use(global);

//ROUTRES LIB
const index = require('./routes/index');
const users = require('./routes/users');

//ROUTES
app.use('/', index);
app.use('/users', users);

//ESTABLISH PORT
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on ${port}...`);
});

//====================================================================
//FUNCTIONS
//====================================================================

async function mongoConnect(key) {
  try {
    await mongoose.connect(key, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB...');
  } catch (err) {
    console.log(err);
  }
}
