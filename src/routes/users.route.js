const express = require('express');

// controller here
const {
  usersAll,
  usersDetail,
  usersUpdate,
  usersUpdatePhoto,
  usersDelete,
} = require('../controllers/users.controller');

// middleware
const jwtAuth = require('../middlewares/JWTAuth');
const validationResult = require('../middlewares/validation');
const upload = require('../middlewares/upload');

// validation rules
const { updateValidation } = require('../validation/users.validation');

const router = express.Router();

router
  .get('/users', jwtAuth, usersAll) // to get all users
  .get('/users/:id', jwtAuth, usersDetail) // to get users detail by id
  .put('/users', jwtAuth, updateValidation, validationResult, usersUpdate) // to update information users
  .put('/users-photo', jwtAuth, upload, usersUpdatePhoto) // update photo
  .delete('/users/:id', jwtAuth, usersDelete);
module.exports = router;
