"use strict";

const multer = require('multer');
const express = require('express');

const userController = require('../controllers/contents.controlers');

const multerMiddleware = multer({ dest: '/tmp/' });
const router = express.Router();
console.log(JSON.stringify(userController));

router.route('/contents')
  .get(userController.list)
  .post(multerMiddleware.single('file'), userController.create);

router.route('/contents/:contentId')
  .get(userController.read);

router.param('contentId', (req, res, next, id) => {
  req.contentId = id;
  next();
});

module.exports = router;
