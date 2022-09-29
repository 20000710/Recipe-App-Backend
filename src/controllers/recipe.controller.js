const {selectAll, select, latest, popular, insert, update, deleteRecipe, countRecipe} = require ('../models/recipe.model');
const {success, failed} = require('../helpers/response');
const { v4: uuidv4 } = require('uuid');
const upload = require('../middlewares/upload');

const recipeController = {
    getAllRecipe: async (req, res) => {
        try {
          const { search, page, limit, sort, mode } = req.query;
          const searchQuery = search || '';
          const pageValue = page ? Number(page) : 1;
          const limitValue = limit ? Number(limit) : 8;
          const offsetValue = (pageValue - 1) * limitValue;
          const sortQuery = sort ? sort : 'title';
          const modeQuery = mode ? mode : 'ASC';
            if (typeof Number(page) == 'number' && typeof Number(limit) == 'number') {
              const result = await selectAll({
                searchQuery,
                offsetValue,
                limitValue,
                sortQuery,
                modeQuery,
              });
              const allRecipe = await countRecipe();
              const totalData = allRecipe.rows[0].total;
              if(search) {
                if (result.rowCount > 0) {
                  const pagination = {
                    currentPage: pageValue,
                    dataPerPage: limitValue,
                    totalPage: Math.ceil(result.rowCount / limitValue),
                  };
                  success(res, {
                    code: 200,
                    status: 'success',
                    message: 'Success get all recipe',
                    data: result.rows,
                    pagination,
                  });
                }else{
                  failed(res, {
                    code: 500,
                    status: 'error',
                    message: `recipe with keyword ${search} is not found`,
                    error: [],
                  });
                }
              }else{
                const pagination = {
                  currentPage: pageValue,
                  dataPerPage: limitValue,
                  totalData: totalData,
                  totalPage: Math.ceil(totalData / limitValue)
                }
                success(res, {
                  code: 200,
                  status: 'success',
                  message: `Success get all recipe`,
                  data: result.rows,
                  pagination,
                });
              }
          }else{
            failed(res, {
              code: 400,
              status: 'error',
              message: 'limit and page value must be number',
              error: [],
            });
          }
        }catch(error) {
            failed(res, {
              code: 500,
              status: 'error',
              message: error.message,
              error: [],
            });
        }
    },
    getRecipe: async (req, res) => {
      try {
        const { id } = req.params;
        const result = await select(id);
        if(result.rowCount > 0) {
          success(res, {
            code: 200,
            status: 'success',
            message: 'Success get recipe by id',
            data: result.rows[0],
          });
        } else {
          failed(res, {
            code: 404,
            status: 'error',
            message: `recipe with id ${id} is not found`,
            error: [],
          });
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
    insertRecipe: async (req, res) => {
      try {
        const {title, ingredients, user_id, liked, saved, popularity, video} = req.body;
        const id = uuidv4();
        const is_active = true;
        const photo = req.file.filename;
        const data = {
          id,
          title, 
          ingredients, 
          user_id, 
          liked, 
          saved, 
          popularity,
          is_active,
          video,
          photo,
        };
        await insert(data);
        success(res, {
          code: 200,
          status: 'success',
          message: 'new recipe has been created',
          data: data,
        });
      } catch (error) {
        failed(res, {
          code: 500,
          status: 'error',
          message: error,
          error: [],
        });
      }
    },
    latestRecipe: async (req, res) => {
      try {
        const {created_at} = req.body;
        const result = await latest(created_at);
        if(result.rowCount > 0) {
          success(res, {
            code: 200,
            status: 'success',
            message: 'Success get latest recipe',
            data: result.rows,
          });
        }else{
          failed(res, {
            code: 404,
            status: 'error',
            message: `latest recipe is not found`,
            error: [],
          });
        }
      }catch(error) {
        failed(res, {
          code: 500,
          status: 'error',
          message: error.message,
          error: [],
        });
      }
    },
    popularRecipe: async (req, res) => {
      try {
        const {popularity} = req.body;
        const result = await popular(popularity);
        if(result.rowCount > 0) {
          success(res, {
            code: 200,
            status: 'success',
            message: 'Success get popular recipe',
            data: result.rows,
          });
        }else{
          failed(res, {
            code: 404,
            status: 'error',
            message: `popular recipe is not found`,
            error: [],
          });
        }
      }catch(error) {
        failed(res, {
          code: 500,
          status: 'error',
          message: error.message,
          error: [],
        });
      }
    },
    updateRecipe: async (req, res) => {
      try {
        const { id } = req.params;
        const {title, ingredients, user_id, liked, saved, popularity, video} = req.body;
        const is_active = true;
        const photo = req.file.filename;
        const recipeCheck = await select(id);
        if (recipeCheck.rowCount > 0) {
          const data = {
            id,
            title, 
            ingredients, 
            is_active, 
            user_id, 
            liked, 
            saved, 
            popularity,
            video,
            photo,
          };
          await update(data);
          success(res, {
            code: 200,
            status: 'success',
            message: 'Success update recipe',
            data: data,
          });
        } else {
          failed(res, {
            code: 404,
            status: 'error',
            message: `recipe with id '${id}' is not found`,
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
    recipeDelete: async (req, res) => {
      try {
        const {id} = req.params;
        const detailRecipe = await select(id);
        if (detailRecipe.rowCount > 0) {
          await deleteRecipe(id);
          success(res, {
            code: 200,
            status: 'success',
            message: `success deleted recipe with id ${id}`,
            error: [],
          });
          return;
        } else {
          failed(res, {
            code: 404,
            status: 'error',
            message: `recipe with id ${id} is not found`,
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

module.exports = recipeController;
