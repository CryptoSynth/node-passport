const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

//Login Page
router.get('/login', (req, res) => {
  res.render('login');
});

//Resister Page
router.get('/register', (req, res) => {
  res.render('register');
});

//Register Handle
router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];

  //check required feilds
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  //check passwords match
  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  //check pass length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0)
    return res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });

  //valadation passed
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      //User exists
      errors.push({ msg: 'Email is already registered!' });
      return res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
    }

    user = new User({
      name,
      email,
      password
    });

    //Hash Password
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(user.password, salt);

      //set password to hashed
      user.password = hashPassword;

      //save user
      await user.save();
      req.flash('success_msg', 'You are now registered and can log in');
      res.redirect('/users/login');
    } catch (err) {
      throw err;
    }
  } catch (err) {
    console.log(err);
  }
});

//Login Handle
router.post('/login', async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
