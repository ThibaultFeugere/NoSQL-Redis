const express = require('express');
const router = express.Router();
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');
const config = require('../config/config.json');

const transporter = nodemailer.createTransport(
  config.gmailConfig
);

const otp = otpGenerator.generate(6, { upperCase: true, specialChars: false });

// TODO : Remove | Temporary because i am waiting the Redis DB
const emailDb = "thibault.feugere@ynov.com";

router.post('/', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  if (req.body.email == emailDb) {
    if (req.body.telegram == 1) {
        console.log('Code sent to telegram');
        res.end('Code sent to telegram');
    } else {
      const mailOptions = {
        from: 'intersport.team.france@gmail.com',
        to: req.body.email,
        subject: 'Your OTP !',
        text: 'Your OTP is : ' + otp,
        html: 'Your OTP is : <strong>' + otp + '</strong>'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response + ' with OTP : ' + otp);
          res.end('Email sent !');
        }
      });
    }
  } else {
    res.end('Error');
  }
});

module.exports = router;