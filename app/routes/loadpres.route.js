'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const config = JSON.parse(process.env.CONFIG);

router.route('/loadPres').get((req, res) => {
  fs.readdir(config.presentationDirectory, (err, files) => {
    if (err) {
      res.status(500).send(`Error server side: ${err}`);
      return console.log('Erreur durant la lecture des du dossier configuration');
    }
    const objectPres = {};
    let fileParsed;
    let compteurFiles = 0;
    files.forEach((fileName) => {
      if (path.extname(fileName) === '.json') {
        fs.readFile(`${config.presentationDirectory}/${fileName}`, (error, file) => {
          compteurFiles += 1;
          if (error) {
            return console.log(`Erreur durant la lecture des fichiers de configuration de présentation : ${err}`);
          }
          fileParsed = JSON.parse(file);
          if (fileParsed.id) {
            objectPres[fileParsed.id] = fileParsed;
          } else {
            console.log(`Error : Enable to find the id of the file ${fileName} in directory presentation`);
          }
          if (compteurFiles === files.length) {
            res.status(200).send(objectPres);
          }
        });
      }
    });
  });
});

module.exports = router;
