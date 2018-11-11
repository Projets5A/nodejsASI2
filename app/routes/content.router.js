"use strict";

const multer = require('multer');
const express = require('express');

const userController = require('../controllers/contents.controlers.js');

const multerMiddleware = multer({ dest: '/tmp/' });
const router = express.Router();

router.route('/contents')
  .get(userController.list)
  .post(multerMiddleware.single('file'), userController.create);

router.route('/contents/:contentId')
  .get(userController.read);

module.exports = router;
