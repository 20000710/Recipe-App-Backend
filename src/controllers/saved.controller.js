const { v4: uuidv4 } = require('uuid');
const savedModel = require('../models/saved.model');
const usersModel = require('../models/users.model');
const { success, failed } = require('../helpers/response');

const savedController = {
  saved: async (req, res) => {
    try {
      const { recipeId } = req.body;
      const userId = req.APP_DATA.tokenDecoded.id;
      const id = uuidv4();

      const userCheck = await usersModel.detail(userId);
      if (userCheck.rowCount > 0) {
        const checkRecipe = await savedModel.getRecipe(recipeId);
        if (checkRecipe.rowCount > 0) {
          const data = {
            id,
            recipeId,
            userId,
          };
          const checkIfSaved = await savedModel.checkIfSaved(data);
          if (checkIfSaved.rowCount == 0) {
            await savedModel.savedData(data);
            let saved = checkRecipe.rows[0].saved + 1;
            let popularity = checkRecipe.rows[0].popularity + 10;
            const dataIfSavedOrUnsaved = {
              recipeId,
              saved,
              popularity,
            };
            await savedModel.updateRecipeIfSavedOrUnsaved(dataIfSavedOrUnsaved);
            success(res, {
              code: 200,
              status: 'success',
              message: 'Success saved this recipe',
              data: data,
            });
          } else {
            failed(res, {
              code: 404,
              status: 'error',
              message: `you have already saved recipe with id ${recipeId}`,
              error: [],
            });
            return;
          }
        } else {
          failed(res, {
            code: 404,
            status: 'error',
            message: `recipe with id ${recipeId} not found`,
            error: [],
          });
          return;
        }
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `users with id ${userId} not found`,
          error: [],
        });
        return;
      }
    } catch (error) {
      failed(res, {
        code: 500,
        status: 'error',
        message: error.message,
        error: [],
      });
    }
  },
  unsaved: async (req, res) => {
    try {
      const { recipeId } = req.body;
      const userId = req.APP_DATA.tokenDecoded.id;
      const userCheck = await usersModel.detail(userId);
      if (userCheck.rowCount > 0) {
        const checkRecipe = await savedModel.getRecipe(recipeId);
        if (checkRecipe.rowCount > 0) {
          const data = {
            recipeId,
            userId,
          };
          const checkIfSaved = await savedModel.checkIfSaved(data);
          if (checkIfSaved.rowCount > 0) {
            await savedModel.unsavedData(data);
            let saved = checkRecipe.rows[0].saved - 1;
            let popularity = checkRecipe.rows[0].popularity - 10;
            const dataIfSavedOrUnsaved = {
              recipeId,
              saved,
              popularity,
            };
            await savedModel.updateRecipeIfSavedOrUnsaved(dataIfSavedOrUnsaved);
            const dataRecipeNow = await savedModel.getRecipe(recipeId);
            success(res, {
              code: 200,
              status: 'success',
              message: 'Success unsaved this recipe',
              data: dataRecipeNow.rows[0],
            });
          } else {
            failed(res, {
              code: 404,
              status: 'error',
              message: `you not saved recipe with id ${recipeId}`,
              error: [],
            });
            return;
          }
        } else {
          failed(res, {
            code: 404,
            status: 'error',
            message: `recipe with id ${recipeId} not found`,
            error: [],
          });
          return;
        }
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `users with id ${userId} not found`,
          error: [],
        });
        return;
      }
    } catch (error) {
      failed(res, {
        code: 500,
        status: 'error',
        message: error.message,
        error: [],
      });
    }
  },
  mySavedRecipe: async (req, res) => {
    try {
      const userId = req.APP_DATA.tokenDecoded.id;
      const userCheck = await usersModel.detail(userId);
      if (userCheck.rowCount > 0) {
        const recipeSaved = await savedModel.checkUsersSavedRecipe(userId);
        if (recipeSaved.rowCount > 0) {
          const mySavedRecipeData = await Promise.all(
            recipeSaved.rows.map(async (item) => {
              let mySavedRecipe = [];
              const data = await savedModel.getRecipe(item.recipe_id);
              mySavedRecipe.push(data.rows[0]);
              return mySavedRecipe[0];
            }),
          );
          success(res, {
            code: 200,
            status: 'success',
            message: 'Success get saved recipe',
            data: mySavedRecipeData,
          });
        } else {
          failed(res, {
            code: 404,
            status: 'error',
            message: `you dont have saved recipe`,
            error: [],
          });
          return;
        }
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `users with id ${id} not found`,
          error: [],
        });
        return;
      }
    } catch (error) {
      failed(res, {
        code: 500,
        status: 'error',
        message: error.message,
        error: [],
      });
    }
  },
  isSaveddRecipe: async (req, res) => {
    try {
      const { recipeId } = req.params;
      const userId = req.APP_DATA.tokenDecoded.id;
      const userCheck = await usersModel.detail(userId);
      if (userCheck.rowCount > 0) {
        const recipeCheck = await savedModel.getRecipe(recipeId);
        if (recipeCheck.rowCount > 0) {
          const data = {
            recipeId,
            userId,
          };
          const checkIfSaved = await savedModel.checkIfSaved(data);
          if (checkIfSaved.rowCount > 0) {
            success(res, {
              code: 200,
              status: 'success',
              message: `Success get status saved recipe with id ${recipeId}`,
              data: checkIfSaved.rows[0],
            });
          } else {
            failed(res, {
              code: 404,
              status: 'error',
              message: `youre not saved this recipe with id ${recipeId}`,
              error: [],
            });
            return;
          }
        } else {
          failed(res, {
            code: 404,
            status: 'error',
            message: `recipe with id ${recipeId} not found`,
            error: [],
          });
          return;
        }
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `user with id ${userId} not found`,
          error: [],
        });
        return;
      }
    } catch (error) {
      failed(res, {
        code: 500,
        status: 'error',
        message: error.message,
        error: [],
      });
    }
  },
};

module.exports = savedController;
