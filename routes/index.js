const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('Projet réalisé par Louis, Antonin, Steven et Thibault')
});

module.exports = router;
