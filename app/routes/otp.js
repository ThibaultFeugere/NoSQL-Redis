const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Temporary because i am waiting the Redis DB
const emailDb = "thibault.feugere@ynov.com";

router.get('/', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  if (req.body.email == emailDb) {

  }
});

module.exports = router;