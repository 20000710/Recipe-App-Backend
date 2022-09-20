const express = require('express');

// controller here
const {
  liked,
  unliked,
  myLikedRecipe,
  isLikedRecipe,
} = require('../controllers/liked.controller');

// middleware
const jwtAuth = require('../middlewares/JWTAuth');
const validationResult = require('../middlewares/validation');
const { isNotCreator } = require('../middlewares/authorization');

// validation rules
const { likedValidation } = require('../validation/liked.validation');

const router = express.Router();

router
  .post(
    '/liked',
    jwtAuth,
    isNotCreator,
    likedValidation,
    validationResult,
    liked,
  ) // to liked a recipe
  .post(
    '/unliked',
    jwtAuth,
    isNotCreator,
    likedValidation,
    validationResult,
    unliked,
  ) // to unliked a recipe
  .get('/my-liked-recipe', jwtAuth, isNotCreator, myLikedRecipe) // to get liked recipes
  .get('/isLiked-recipe/:recipeId', jwtAuth, isNotCreator, isLikedRecipe); // to check if liked recipe or not
module.exports = router;
