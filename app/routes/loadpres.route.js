'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const config = JSON.parse(process.env.CONFIG);

router.route('/loadPres').get((req, res) => {

  function readfiles(filesname) {
    const objectPres = {};
    filesname.forEach((filename) => {
      fs.readFile(`${config.presentationDirectory}/${filename}`, (error, file) => {
        if (error) {
          res.status(500).send(`Error server side: ${error.message}`);
          return console.error(error);
        }
        const fileParsed = JSON.parse(file);
        if (fileParsed.id) {
          objectPres[fileParsed.id] = fileParsed;
        } else {
          console.log(`Error : Enable to find the id of the file ${file} in directory presentation`);
        }
        if (Object.keys(objectPres).length === filesname.length) {
          res.status(200).send(objectPres);
        }
      });
    });
  }

  fs.readdir(config.presentationDirectory, (err, files) => {
    if (err) {
      res.status(500).send(`Error server side: ${err.message}`);
      return console.error(err);
    }
    const jsonfiles = [];
    for (let i = 0; i < files.length; i += 1) {
      if (path.extname(files[i]) === '.json') {
        jsonfiles.push(files[i]);
      }
    }
    readfiles(jsonfiles);
  });
});

module.exports = router;
