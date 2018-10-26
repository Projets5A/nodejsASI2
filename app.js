'use strict';

const express = require("express");
const http = require("http");
const path = require("path");
const CONFIG = require("./config.json");

process.env.CONFIG = JSON.stringify(CONFIG);

const app = express();

const defaultRoute = require("./app/routes/default.route.js");
const loadPres = require("./app/routes/loadpres.route.js");
const savePres = require("./app/routes/savepres.route.js");
const content = require("./app/routes/content.router.js")

app.use(defaultRoute);
app.use(loadPres);
app.use(savePres);
app.use(content);
app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.use("/watch", express.static(path.join(__dirname, "public/watch")));

const server = http.createServer(app);
server.listen(CONFIG.port);
