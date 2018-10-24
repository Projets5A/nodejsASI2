'use strict';

const express = require('express');

const router = express.Router();

router.route('/').get((req, res) => {
  res.send("it works");
});

module.exports = router;
