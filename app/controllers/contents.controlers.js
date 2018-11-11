const fs = require('fs');
const path = require('path');
const ContentModel = require('../models/content.model.js');
const utils = require('../utils/utils');

const config = JSON.parse(process.env.CONFIG);

const userController = {
  create(req, res) {
    if ((req.file && req.body.type === 'img') || (req.body.type !== 'img' && req.body.src && !req.file)) {
      const uid = utils.generateUUID();
      const newObject = {
        fileName: req.file ? uid + path.extname(req.file.originalname) : null,
        id: uid,
        type: req.body.type,
        title: req.body.title,
        src: req.body.type === 'img' ? '/contents/' + uid : req.body.src,
      };
      const newContent = new ContentModel(newObject);
      if (req.file) {
        fs.readFile(req.file.path, (error, file) => {
          if (error) { return res.status(400).send(error); }
          newContent.setData(file);
          ContentModel.create(newContent, (err) => {
            if (err) { return res.status(400).send(err); }
            res.status(200).send(uid);
          });
        });
      } else {
        ContentModel.create(newContent, (err) => {
          if (err) { return res.status(400).send(err); }
          res.status(200).send(uid);
        });
      }
    } else {
      res.status(404).send('bad parameters !');
    }
  },
  read(req, res) {
    ContentModel.read(req.params.contentId, (err, file) => {
      if (err) { return res.status(400).send(err); }
      if (req.query.json) {
        return res.status(200).send(file);
      }
      if (file.type === 'img') {
        return res.status(200).sendFile(fs.realpathSync(path.join(config.contentDirectory, file.fileName)));
      }
      return res.redirect(file.src);
    });
  },
  list(req, res) {
    const objectPres = {};
    fs.readdir(`${config.contentDirectory}`, (error, files) => {
      if (error) {
        res.status(500).send(`Error server side: ${error.message}`);
        return console.error(error);
      }
      const jsonfiles = [];
      for (let i = 0; i < files.length; i += 1) {
        if (path.extname(files[i]) === '.json') {
          jsonfiles.push(files[i]);
        }
      }
      if (jsonfiles.length !== 0) {
        jsonfiles.forEach((file) => {
          console.log(file);
          if (path.extname(file) === '.json' && file.indexOf('meta') !== -1) {
            fs.readFile(path.join(config.contentDirectory, file), (err, fileContent) => {
              if (err) { return console.error(err); }
              objectPres[file] = JSON.parse(fileContent);
              if (Object.keys(objectPres).length === jsonfiles.length) {
                res.status(200).send(objectPres);
              }
            });
          }
        });
      } else {
        res.status(200).send(objectPres);
      }
    });
  },
};

module.exports = userController;
