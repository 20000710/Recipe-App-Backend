const express = require('express');
const {getAllRecipe, getRecipe, latestRecipe, popularRecipe, insertRecipe, updateRecipe, recipeDelete} = require('../controllers/recipe.controller');
const upload = require('../middlewares/upload')

const router = express.Router();

router
    .get('/recipe', getAllRecipe)
    .get('/recipe/latest', latestRecipe)
    .get('/recipe/popular', popularRecipe)
    .get('/recipe/:id', getRecipe)
    .post('/recipe', upload, insertRecipe)
    .put('/recipe/:id', upload, updateRecipe)
    .delete('/recipe/:id', recipeDelete);

module.exports = router;