const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  if (req.body.email) {
    
  }
});

module.exports = router;