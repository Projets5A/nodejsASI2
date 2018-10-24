'use strict';

const express = require("express");
const http = require("http");
const path = require("path");
const CONFIG = require("./config.json");
const bodyParser = require('body-parser');

process.env.CONFIG = JSON.stringify(CONFIG);

const app = express();

app.use(bodyParser.json());

const defaultRoute = require("./app/routes/default.route.js");
const loadPres = require("./app/routes/loadpres.route.js");
const savePres = require("./app/routes/savepres.route.js");

app.use(defaultRoute);
app.use(loadPres);
app.use(savePres);
app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.use("/watch", express.static(path.join(__dirname, "public/watch")));

const server = http.createServer(app);
server.listen(CONFIG.port);
