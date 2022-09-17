const { check } = require('express-validator');

const likedValidation = [
  // recipeId
  check('recipeId', 'recipe_id cannot be empty').not().isEmpty(),
];

module.exports = { likedValidation };
