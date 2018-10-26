'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const config = JSON.parse(process.env.CONFIG);

router.route('/savePres').post((req, res) => {
  let body = "";
  req.on("data", (data) => {
    body += data.toString();
  });

  req.on("end", () => {
    body = JSON.parse(body);
    fs.writeFile(path.join(config.presentationDirectory, `${body.id}.pres.json`), JSON.stringify(body), (error) => {
      if (error) {
        res.status(400).send(`Opening didnt work: ${error.message}`);
        return console.log(error);
      }
      res.status(201).send('JSON well writed !');
    });
  });
});

module.exports = router;
