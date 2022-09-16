const express = require('express');
const {getAllRecipe, getRecipe, insertRecipe, updateRecipe, recipeDelete} = require('../controllers/recipe.controller');
// const jwtAuth = require('../middlewares/JWTAuth');
// const validationResult = require('../middlewares/validation');
// const { updateValidation } = require ('../validation/users.validation')

const router = express.Router();

router
    .get('/recipe', getAllRecipe)
    .get('/recipe/:id', getRecipe)
    .post('/recipe', insertRecipe)
    .put('/recipe/:id', updateRecipe)
    .delete('/recipe/:id', recipeDelete);

module.exports = router;