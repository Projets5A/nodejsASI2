'use strict';

const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const CONFIG = require("./config.json");

process.env.CONFIG = JSON.stringify(CONFIG);

const app = express();
app.use(cors());

const defaultRoute = require("./app/routes/default.route.js");
const loadPres = require("./app/routes/loadpres.route.js");
const savePres = require("./app/routes/savepres.route.js");
const content = require("./app/routes/content.router.js")
const IOController = require("./app/controllers/io.controller.js");

app.use(defaultRoute);
app.use(loadPres);
app.use(savePres);
app.use(content);
app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.use("/watch", express.static(path.join(__dirname, "public/watch")));

const server = http.createServer(app);
server.listen(CONFIG.port);
const iocontroller = new IOController();
iocontroller.listen(server);
