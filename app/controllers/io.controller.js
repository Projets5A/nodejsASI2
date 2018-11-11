
const io = require('socket.io');
const fs = require("fs");

const config = JSON.parse(process.env.CONFIG);

class IOController {

  constructor() {
    this.serverWS = null;
    this.socketMap = [];
  }

  listen(serverHTTP) {
    this.serverWS = io.listen(serverHTTP);
    this.serverActions();
    this.pause = false;
    this.presentation = [];
    this.iterator = null;
    this.intervalPres = null;
  }

  serverActions() {
    this.serverWS.on('connection', (socket) => {
      console.log('new connection to WS server !');
      socket.emit('connected', { msg: 'well connected with WebSocket' });

      socket.on('slidEvent', (data) => {
        switch (data.CMD) {
          case 'START':
            if (this.iterator) {
              this.intervalPres = setInterval(() => {
                if (!this.iterator.next(socket, 0)) {
                  clearInterval(this);
                }
              }, 2000);
            }
            break;
          case 'PAUSE':
            if (this.intervalPres) {
              clearInterval(this.intervalPres);
            }
            break;
          case 'END':
            if (this.intervalPres) {
              clearInterval(this.intervalPres);
            }
            this.iterator = null;
            break;
          case 'BEGIN':
            this.readPres(data.presID, (err, pres) => {
              if (err) { 
                console.error(err);
                socket.emit(err);
              } else { 
                this.presentation = [];
                for (let key of pres.slidArray) {
                  this.presentation.push(pres.slidArray[key]);
                }
                this.iterator = this.presIterator(socket);
                this.intervalPres = setInterval(() => {
                  if (!this.iterator.next(socket, 0)) {
                    clearInterval(this.intervalPres);
                  }
                }, 2000);
              }
            });
            break;
          case 'PREV':
            if (this.iterator) {
              this.iterator.next(socket, -1);
            }
            break;
          case 'NEXT':
            if (this.iterator) {
              this.iterator.next(socket, 1);
            }
            break;
          default:
            break;
        }
      });

      socket.on('data_comm', (data) => {
        this.socketMap[data.id] = data.socket;
      });
    });
  }

  readPres(presID, callback) {
    fs.readdir(config.presentationDirectory, (err, files) => {
      if (err) { return callback(err, null); }
      files.forEach((file) => {
        fs.readFile(file, (error, data) => {
          if (error) { return callback(error, null); }
          if (JSON.parse(data).id === presID) {
            return callback(null, JSON.parse(data));
          }
        });
      });
    });
  }

  presIterator() {
    let iterationCount = 0;
    const end = this.presentation.length;

    const rangeIterator = {
      next: (socket, offset) => {
        iterationCount += offset;
        socket.emit("content", this.presentation[iterationCount]);
        iterationCount += 1;
        return iterationCount < end;
      },
    };
    return rangeIterator;
  }
}

module.exports = IOController;
