'use strict';

const express = require('express');
const fs = require('fs');

const router = express.Router();
const config = JSON.parse(process.env.CONFIG);

router.route('/savePres').post((req, res) => {
  if (req.body) {
    const jsonConf = req.body;
    fs.open(`${config.presentationDirectory}/${jsonConf.id}.pres.json`, 'w', (error, file) => {
      if (error) {
        res.status(400).send('Opening didnt end well');
        return console.log(error);
      }
      fs.write(file, JSON.stringify(jsonConf), 'UTF-8', (err) => {
        if (err) {
          res.status(400).send('Writing didnt end well');
          return console.log(err);
        }
        res.status(202).send('JSON well writed !');
      });
    });
  } else {
    res.status(400).send('JSON in requets is missing');
  }
});

module.exports = router;
