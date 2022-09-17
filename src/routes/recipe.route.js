const express = require('express');
const {getAllRecipe, getRecipe, latestRecipe, insertRecipe, updateRecipe, recipeDelete} = require('../controllers/recipe.controller');
const jwtAuth = require('../middlewares/JWTAuth');

const router = express.Router();

router
    .get('/recipe', getAllRecipe)
    .get('/recipe/latest', latestRecipe)
    .get('/recipe/:id', getRecipe)
    .post('/recipe', jwtAuth, insertRecipe)
    .put('/recipe/:id', jwtAuth, updateRecipe)
    .delete('/recipe/:id', jwtAuth, recipeDelete);

module.exports = router;