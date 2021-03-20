const express = require('express');
const bcrypt = require('bcrypt');
const config = require('../config/config.json');
const redis = require('redis');

const client = redis.createClient(config.redisConfig);

const saltRounds = 12;
const router = express.Router();
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.email && req.body.password) {
        // Store vars
        const email = req.body.email;
        const password = req.body.password;
        if (emailRegex.test(email)) {
            bcrypt.hash(password, saltRounds, function(err, hash) {
                res.send(email + ' ' + password + ' ' + hash);
                client.sadd("users", "email:" + email);
                client.hmset("email:" + email, "email", email, "password", hash);
                client.quit();
            });
        } else {
            res.end("Error : 'email' value need to be valid.");
        }
    } else {
        res.end("Error : 'email' and 'password' values are required in order to be registered.");
    }
});

module.exports = router;