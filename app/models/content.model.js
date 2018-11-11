const fs = require("fs");
const utils = require("../utils/utils");

class ContentModel {
  constructor({ type, id, title, src, fileName }) {
    this.type = type;
    this.id = id;
    this.title = title;
    this.src = src;
    this.fileName = fileName;
    let data;
    this.setData = (dataOverride) => { data = dataOverride; };
    this.getData = () => data;
  }

  static create(content, callback) {
    if (content && content.id) {
      fs.writeFile(utils.getMetaFilePath(content.id), JSON.stringify(content), (error) => {
        if (error) { return callback(error); }
        if (content.type !== "video" && content.type !== "img_url" && content.type !== "web") {
          fs.writeFile(utils.getDataFilePath(content.fileName), content.getData(), (err) => {
            if (err) { return callback(err); }
            return callback();
          });
        } else {
          return callback();
        }
      });
    } else {
      callback("Content is missing when creating");
    }
  }

  static read(id, callback) {
    if (id) {
      utils.readFileIfExists(utils.getMetaFilePath(id), (err, file) => {
        return callback(err, new ContentModel(JSON.parse(file)));
      });
    } else {
      callback("ID missing when reading");
    }
  }

  static update(content, callback) {
    if (content && content.id) {
      utils.fileExists(utils.getMetaFilePath(content.id), (err1) => {
        if (err1) { return callback(err1); }
        fs.writeFile(utils.getMetaFilePath(content.id), JSON.stringify(content), (err2) => {
          if (err2) { return callback(err2); }
          if (content.getData() && content.getData().length > 0) {
            utils.fileExists(utils.getMetaFilePath(content.id), (err3) => {
              if (err3) { return callback(err3); }
              fs.writeFile(utils.getDataFilePath(content.fileName), content.getData(), (err4) => {
                return callback(err4);
              });
            });
          } else {
            callback();
          }
        });
      });
    } else {
      callback("Content malformed during updating");
    }
  }

  static delete(id, callback) {
    let compteur = 0;
    if (id) {
      utils.readFileIfExists(utils.getMetaFilePath(id), (err, file) => {
        if (err) { return callback(err); }
        fs.unlink(utils.getDataFilePath(JSON.parse(file).fileName), (error) => {
          compteur += 1;
          if (error) { return callback(err); }
          if (compteur === 2) {
            return callback();
          }
        });
        fs.unlink(utils.getMetaFilePath(id), (error) => {
          compteur += 1;
          if (error) { return callback(error); }
          if (compteur === 2) {
            return callback();
          }
        });
      });
    } else {
      callback("ID missing when deleting");
    }
  }
}

module.exports = ContentModel;
