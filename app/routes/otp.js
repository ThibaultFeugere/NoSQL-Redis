const express = require('express');
const router = express.Router();
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');
const config = require('../config/config.json');
const redis = require('redis');
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const client = redis.createClient(config.redisConfig);

const transporter = nodemailer.createTransport(
  config.gmailConfig
);

const otp = otpGenerator.generate(6, { upperCase: true, specialChars: false }).toUpperCase();

Date.prototype.addMinutes = function(minutes) {
    this.setMinutes(this.getMinutes() + minutes);
    return this;
};

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    // On vérifie qu'il y a bien un email de fournit dans la requête POST
    if (req.body.email !== undefined && req.body.email !== null) {
        // On vérifie que l'email est au format correcte
        if (emailRegex.test(email)) {
            // On cherche l'email renseignée dans le base de données
            client.hgetall("email:" + req.body.email, function (err, obj) {
                // On vérifie qu'on a trouvé l'email dans la base de données
                if (obj !== null) {
                    // On vérifie qu'il n'est pas connecté pour envoyer l'email
                    if (obj.login == 0) {
                        // On vérifie qu'il n'y a pas de code OTP déjà envoyé dans les 5 dernières minutes
                        if (obj.otpValidity < Date.now()) {
                            const mailOptions = {
                                from: 'intersport.team.france@gmail.com',
                                to: obj.email,
                                subject: 'Your OTP !',
                                text: 'Your OTP is : ' + otp,
                                html: 'Your OTP is : <strong>' + otp + '</strong>'
                            };
                            client.hset("email:" + obj.email, "otp", otp, "otpValidity", new Date.addMinutes(5), function (err, obj) {
                                transporter.sendMail(mailOptions, function(error, info){
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log("Email sent: " + info.response + " with OTP : " + otp);
                                        res.end("Email sent to " + obj.email + " valid for 5 minutes.");
                                    }
                                });                    
                            });
                        } else {
                            res.send("Un code vous a déjà été envoyé au cours de ces 5 dernières minutes.");
                        }
                    } else {
                        res.send("Compte déjà connecté.")
                    }
                } else {
                    res.send("Erreur");
                }
            });
        } else {
            res.send("Email invalide.")
        }
    } else {
        res.send("Un email est nécessaire.");
    }
});

module.exports = router;