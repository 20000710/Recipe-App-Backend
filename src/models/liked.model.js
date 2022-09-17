const db = require('../config/db');

const likedModel = {
  getRecipe: (recipeId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `
      SELECT * FROM recipe WHERE id='${recipeId}'
      `,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        },
      );
    });
  },
  checkIfLiked: (data) => {
    const { recipeId, userId } = data;
    return new Promise((resolve, reject) => {
      db.query(
        `
        SELECT * FROM liked WHERE recipe_id='${recipeId}' AND user_id='${userId}'
        `,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        },
      );
    });
  },
  likedData: (data) => {
    const { id, recipeId, userId } = data;
    return new Promise((resolve, reject) => {
      db.query(
        `
      INSERT INTO liked(id,recipe_id,user_id) 
      VALUES ('${id}','${recipeId}','${userId}')
      `,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        },
      );
    });
  },
  unlikedData: (data) => {
    const { recipeId, userId } = data;
    return new Promise((resolve, reject) => {
      db.query(
        `
      DELETE FROM liked WHERE recipe_id='${recipeId}' AND user_id='${userId}'
      `,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        },
      );
    });
  },
  updateRecipeIfLikedOrUnliked: (dataIfLikedOrUnliked) => {
    const { recipeId, liked, popularity } = dataIfLikedOrUnliked;
    return new Promise((resolve, reject) => {
      db.query(
        `
      UPDATE recipe SET liked=${liked},popularity=${popularity} WHERE recipe.id='${recipeId}'
      `,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        },
      );
    });
  },
  checkUsersLikedRecipe: (userId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `
      SELECT * FROM liked WHERE user_id='${userId}'
      `,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        },
      );
    });
  },
};

module.exports = likedModel;
