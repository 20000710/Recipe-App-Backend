const db = require('../config/db');

const savedModel = {
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
  checkIfSaved: (data) => {
    const { recipeId, userId } = data;
    return new Promise((resolve, reject) => {
      db.query(
        `
        SELECT * FROM saved WHERE recipe_id='${recipeId}' AND user_id='${userId}'
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
  savedData: (data) => {
    const { id, recipeId, userId } = data;
    return new Promise((resolve, reject) => {
      db.query(
        `
      INSERT INTO saved(id,recipe_id,user_id) 
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
  unsavedData: (data) => {
    const { recipeId, userId } = data;
    return new Promise((resolve, reject) => {
      db.query(
        `
      DELETE FROM saved WHERE recipe_id='${recipeId}' AND user_id='${userId}'
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
  updateRecipeIfSavedOrUnsaved: (dataIfSavedOrUnsaved) => {
    const { recipeId, saved, popularity } = dataIfSavedOrUnsaved;
    return new Promise((resolve, reject) => {
      db.query(
        `
      UPDATE recipe SET saved=${saved},popularity=${popularity} WHERE recipe.id='${recipeId}'
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
  checkUsersSavedRecipe: (userId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `
      SELECT * FROM saved WHERE user_id='${userId}'
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

module.exports = savedModel;
