const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const config = require('../config/config.json');
const redis = require('redis');

const client = redis.createClient(config.redisConfig);

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.email && req.body.password) {
        // Store vars
        const email = req.body.email;
        const password = req.body.password;

        client.hgetall("email:" + email, function (err, obj) {
            if (null !== obj) {
                bcrypt.compare(password, obj.password, function(err, result) {
                    if (email == obj.email && result == true) {
                        res.send('Vous êtes connecté, pour vous déconnecter, rendez-vous sur /logout');
                    } else {
                        res.send('Email ou mdp invalide');
                    }
                });
            } else {
                res.send('Mauvais email ou mot de passe')
            }
        });
    }
});

module.exports = router;