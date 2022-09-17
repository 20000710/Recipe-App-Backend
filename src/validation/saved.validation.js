const { check } = require('express-validator');

const savedValidation = [
  // recipeId
  check('recipeId', 'recipe_id cannot be empty').not().isEmpty(),
];

module.exports = { savedValidation };
