const { check } = require('express-validator');

const addValidation = [
  // recipeId
  check('recipeId', 'recipe_id cannot be empty').not().isEmpty(),

  // commentText
  check('commentText', 'comment text cannot be empty').not().isEmpty(),
];
const updateValidation = [
  // commentText
  check('commentText', 'comment text cannot be empty').not().isEmpty(),
];

module.exports = { addValidation, updateValidation };
