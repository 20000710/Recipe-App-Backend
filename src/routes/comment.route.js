const express = require('express');

// controller here
const {
  commentAdd,
  commentAll,
  commentDetail,
  commentUpdate,
  commentDelete,
  commentByRecipe,
} = require('../controllers/comment.controller');

// middleware
const jwtAuth = require('../middlewares/JWTAuth');
const validationResult = require('../middlewares/validation');
const { isNotCreator } = require('../middlewares/authorization');

// validation rules
const {
  addValidation,
  updateValidation,
} = require('../validation/comment.validation');

const router = express.Router();

router
  .get('/comment', jwtAuth, commentAll) // get all comment
  .get('/comment/:id', jwtAuth, commentDetail) // get detail comment by id
  .post(
    '/comment',
    jwtAuth,
    isNotCreator,
    addValidation,
    validationResult,
    commentAdd,
  ) // add comment
  .put(
    '/comment/:id',
    jwtAuth,
    isNotCreator,
    updateValidation,
    validationResult,
    commentUpdate,
  ) // to update comment
  .delete('/comment/:id', jwtAuth, isNotCreator, commentDelete) // to delete comment
  .get('/comment/recipe/:recipeid', jwtAuth, commentByRecipe);

module.exports = router;
