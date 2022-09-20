const { v4: uuidv4 } = require('uuid');
const likedModel = require('../models/liked.model');
const usersModel = require('../models/users.model');
const { success, failed } = require('../helpers/response');

const likedController = {
  liked: async (req, res) => {
    try {
      const { recipeId } = req.body;
      const userId = req.APP_DATA.tokenDecoded.id;
      const id = uuidv4();

      const userCheck = await usersModel.detail(userId);
      if (userCheck.rowCount > 0) {
        const checkRecipe = await likedModel.getRecipe(recipeId);
        if (checkRecipe.rowCount > 0) {
          const data = {
            id,
            recipeId,
            userId,
          };
          const checkIfLiked = await likedModel.checkIfLiked(data);
          if (checkIfLiked.rowCount == 0) {
            await likedModel.likedData(data);
            let liked = checkRecipe.rows[0].liked + 1;
            let popularity = checkRecipe.rows[0].popularity + 5;
            const dataIfLikedOrUnliked = {
              recipeId,
              liked,
              popularity,
            };
            await likedModel.updateRecipeIfLikedOrUnliked(dataIfLikedOrUnliked);
            success(res, {
              code: 200,
              status: 'success',
              message: 'Success liked this recipe',
              data: data,
            });
          } else {
            failed(res, {
              code: 404,
              status: 'error',
              message: `you have already liked recipe with id ${recipeId}`,
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
  unliked: async (req, res) => {
    try {
      const { recipeId } = req.body;
      const userId = req.APP_DATA.tokenDecoded.id;
      const userCheck = await usersModel.detail(userId);
      if (userCheck.rowCount > 0) {
        const checkRecipe = await likedModel.getRecipe(recipeId);
        if (checkRecipe.rowCount > 0) {
          const data = {
            recipeId,
            userId,
          };
          const checkIfLiked = await likedModel.checkIfLiked(data);
          if (checkIfLiked.rowCount > 0) {
            await likedModel.unlikedData(data);
            let liked = checkRecipe.rows[0].liked - 1;
            let popularity = checkRecipe.rows[0].popularity - 5;
            const dataIfLikedOrUnliked = {
              recipeId,
              liked,
              popularity,
            };
            await likedModel.updateRecipeIfLikedOrUnliked(dataIfLikedOrUnliked);
            const dataRecipeNow = await likedModel.getRecipe(recipeId);
            success(res, {
              code: 200,
              status: 'success',
              message: 'Success unliked this recipe',
              data: dataRecipeNow.rows[0],
            });
          } else {
            failed(res, {
              code: 404,
              status: 'error',
              message: `you not liked recipe with id ${recipeId}`,
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
  myLikedRecipe: async (req, res) => {
    try {
      const userId = req.APP_DATA.tokenDecoded.id;
      const userCheck = await usersModel.detail(userId);
      if (userCheck.rowCount > 0) {
        const recipeLiked = await likedModel.checkUsersLikedRecipe(userId);
        if (recipeLiked.rowCount > 0) {
          const myLikedRecipeData = await Promise.all(
            recipeLiked.rows.map(async (item) => {
              let myLikedRecipe = [];
              const data = await likedModel.getRecipe(item.recipe_id);
              myLikedRecipe.push(data.rows[0]);
              return myLikedRecipe[0];
            }),
          );
          success(res, {
            code: 200,
            status: 'success',
            message: 'Success get liked recipe',
            data: myLikedRecipeData,
          });
        } else {
          failed(res, {
            code: 404,
            status: 'error',
            message: `you dont have liked recipe`,
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
  isLikedRecipe: async (req, res) => {
    try {
      const { recipeId } = req.params;
      const userId = req.APP_DATA.tokenDecoded.id;
      const userCheck = await usersModel.detail(userId);
      if (userCheck.rowCount > 0) {
        const recipeCheck = await likedModel.getRecipe(recipeId);
        if (recipeCheck.rowCount > 0) {
          const data = {
            recipeId,
            userId,
          };
          const checkIfLiked = await likedModel.checkIfLiked(data);
          if (checkIfLiked.rowCount > 0) {
            success(res, {
              code: 200,
              status: 'success',
              message: `Success get status liked recipe with id ${recipeId}`,
              data: checkIfLiked.rows[0],
            });
          } else {
            failed(res, {
              code: 404,
              status: 'error',
              message: `youre not liked this recipe with id ${recipeId}`,
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

module.exports = likedController;
