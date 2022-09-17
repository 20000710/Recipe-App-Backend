const express = require('express');

// controller here
const {
  saved,
  unsaved,
  mySavedRecipe,
  isSaveddRecipe,
} = require('../controllers/saved.controller');

// middleware
const jwtAuth = require('../middlewares/JWTAuth');
const validationResult = require('../middlewares/validation');
const { isNotCreator } = require('../middlewares/authorization');

// validation rules
const { savedValidation } = require('../validation/saved.validation');

const router = express.Router();

router
  .post(
    '/saved',
    jwtAuth,
    isNotCreator,
    savedValidation,
    validationResult,
    saved,
  ) // to saved recipe
  .post(
    '/unsaved',
    jwtAuth,
    isNotCreator,
    savedValidation,
    validationResult,
    unsaved,
  ) // to unsaved recipe
  .get('/my-saved-recipe', jwtAuth, isNotCreator, mySavedRecipe) // to get saved recipes
  .get('/isSaved-recipe/:recipeId', jwtAuth, isNotCreator, isSaveddRecipe); // to check if saved recipe or not

module.exports = router;
