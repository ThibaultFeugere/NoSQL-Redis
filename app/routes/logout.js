const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  console.log('logout')
});

module.exports = router;