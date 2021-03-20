const express = require('express');
const router = express.Router();

router.get('/', function () {
  console.log('Projet réalisé par Louis, Antonin, Steven et Thibault')
});

module.exports = router;
