const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

//Home Page
router.get('/', (req, res) => {
  res.render('welcome');
});

//Dashboard
router.get('/dashboard', auth, (req, res) => {
  res.render('dashboard', { name: req.user.name });
});

module.exports = router;
