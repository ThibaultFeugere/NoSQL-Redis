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
    // On verifie qu'il y ait bien les deux parametres obligatoires
    if (req.body.email && req.body.password) {
        const email = req.body.email;
        const password = req.body.password;
        // On verifie que l'email soit valide
        if (emailRegex.test(email)) {
            client.hgetall("email:" + email, function (err, obj) {
                if (obj == undefined) {
                    // On hash le mot de passe pour le stocker
                    bcrypt.hash(password, saltRounds, function(err, hash) {
                        res.send("Compté créé, veuillez vous connecter sur /login");
                        client.sadd("users", "email:" + email);
                        client.hmset("email:" + email, "email", email, "password", hash, "login", 0, "otp", "", "otpValidity", 0);
                    });
                } else {
                    res.send("L'inscription n'a pas pu aboutir...")
                }
            });
        } else {
            res.end("Error : 'email' value need to be valid.");
        }
    } else {
        res.end("Error : 'email' and 'password' values are required in order to be registered.");
    }
});

module.exports = router;