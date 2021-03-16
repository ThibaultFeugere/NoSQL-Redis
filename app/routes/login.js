const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// Temporary because i am waiting the Redis DB
const emailDb = "thibault.feugere@ynov.com";
const hashDb = "$2b$12$id5DcgsbZfK2B65VKvWhdezakOzuVpuUeMj7RpKq11ZOWcSOY9qhu"; // hash = "mdp"

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.email && req.body.password) {
        // Store vars
        const email = req.body.email;
        const password = req.body.password;

        bcrypt.compare(password, hashDb, function(err, result) {
          if (email == emailDb && result == true) {
            res.send('Email et mdp valide');
          } else {
            res.send('Email ou mdp invalide');
          }
        });
  }
});

module.exports = router;