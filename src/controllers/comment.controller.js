const commentModel = require('../models/comment.model');
const { v4: uuidv4 } = require('uuid');
const { success, failed } = require('../helpers/response');
const usersModel = require('../models/users.model');

const commentController = {
  commentAll: async (req, res) => {
    try {
      const { search, page, limit, sort, mode } = req.query;
      const searchQuery = search || '';
      const pageValue = page ? Number(page) : 1;
      const limitValue = limit ? Number(limit) : 5;
      const offsetValue = (pageValue - 1) * limitValue;
      const sortQuery = sort ? sort : 'created_at';
      const modeQuery = mode ? mode : 'ASC';
      if (typeof Number(page) == 'number' && typeof Number(limit) == 'number') {
        const allData = await commentModel.allData();
        const totalData = allData.rows[0].total;
        const result = await commentModel.commentAllData(
          searchQuery,
          offsetValue,
          limitValue,
          sortQuery,
          modeQuery,
        );
        const dataPerPage =
          limitValue > result.rowCount ? result.rowCount : limitValue;

        if (search) {
          if (result.rowCount > 0) {
            const pagination = {
              currentPage: pageValue,
              dataPerPage: dataPerPage,
              totalPage: Math.ceil(result.rowCount / limitValue),
            };
            success(res, {
              code: 200,
              status: 'success',
              message: 'Success get all comment',
              data: result.rows,
              pagination,
            });
          } else {
            failed(res, {
              code: 500,
              status: 'error',
              message: `comment with keyword ${search} not found`,
              error: [],
            });
          }
        } else {
          const pagination = {
            currentPage: pageValue,
            dataPerPage: dataPerPage,
            totalPage: Math.ceil(totalData / limitValue),
          };

          success(res, {
            code: 200,
            status: 'success',
            message: `Success get all comment`,
            data: result.rows,
            pagination,
          });
        }
      } else {
        failed(res, {
          code: 400,
          status: 'error',
          message: 'limit and page value must be number',
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
  commentDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await commentModel.commentDetailData(id);
      if (result.rowCount > 0) {
        success(res, {
          code: 200,
          status: 'success',
          message: 'Success get comment by id',
          data: result.rows[0],
        });
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `comment with id ${id} not found`,
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
  commentAdd: async (req, res) => {
    try {
      const { recipeId, commentText } = req.body;
      const id = uuidv4();
      const usersId = req.APP_DATA.tokenDecoded.id;
      const userCheck = await usersModel.detail(usersId);
      // check user if exist
      if (userCheck.rowCount > 0) {
        const recipeCheck = await commentModel.recipeCheck(recipeId);
        if (recipeCheck.rowCount > 0) {
          const data = {
            id,
            recipeId,
            usersId,
            commentText,
          };
          await commentModel.commentAddData(data);
          success(res, {
            code: 200,
            status: 'success',
            message: 'Success adding comment',
            data: data,
          });
        } else {
          failed(res, {
            code: 404,
            status: 'error',
            message: `recipe with id ${id} not found`,
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
  commentUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const { commentText } = req.body;
      const commentCheck = await commentModel.commentDetailData(id);

      if (commentCheck.rowCount > 0) {
        if (commentCheck.rows[0].user_id == req.APP_DATA.tokenDecoded.id) {
          await commentModel.commentUpdateData(id, commentText);
          const newData = await commentModel.commentDetailData(id);
          success(res, {
            code: 200,
            status: 'success',
            message: 'Success update comment',
            data: newData.rows[0],
          });
        } else {
          failed(res, {
            code: 409,
            status: 'error',
            message: `Its not your comment`,
            error: [],
          });
        }
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `comment with id ${id} not found`,
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
  commentDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const commentCheck = await commentModel.commentDetailData(id);

      if (commentCheck.rowCount > 0) {
        if (commentCheck.rows[0].user_id == req.APP_DATA.tokenDecoded.id) {
          await commentModel.commentDeleteData(id);
          success(res, {
            code: 200,
            status: 'success',
            message: 'Success delete comment',
            data: [],
          });
        } else {
          failed(res, {
            code: 409,
            status: 'error',
            message: `Its not your comment`,
            error: [],
          });
        }
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `comment with id ${id} not found`,
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
  commentByRecipe: async (req, res) => {
    try {
      const { recipeid } = req.params;
      const recipeCheck = await commentModel.recipeCheck(recipeid);
      if (recipeCheck.rowCount > 0) {
        const { search, page, limit, sort, mode } = req.query;
        const searchQuery = search || '';
        const pageValue = page ? Number(page) : 1;
        const limitValue = limit ? Number(limit) : 5;
        const offsetValue = (pageValue - 1) * limitValue;
        const sortQuery = sort ? sort : 'created_at';
        const modeQuery = mode ? mode : 'ASC';
        if (
          typeof Number(page) == 'number' &&
          typeof Number(limit) == 'number'
        ) {
          const allData = await commentModel.allDataByRecipe(recipeid);
          const totalData = allData.rows[0].total;
          const result = await commentModel.commentAllDataByRecipe(
            searchQuery,
            offsetValue,
            limitValue,
            sortQuery,
            modeQuery,
            recipeid,
          );
          const dataPerPage =
            limitValue > result.rowCount ? result.rowCount : limitValue;
          if (search) {
            if (result.rowCount > 0) {
              const pagination = {
                currentPage: pageValue,
                dataPerPage: dataPerPage,
                totalPage: Math.ceil(result.rowCount / limitValue),
              };
              success(res, {
                code: 200,
                status: 'success',
                message: 'Success get all comment by recipe',
                data: result.rows,
                pagination,
              });
            } else {
              failed(res, {
                code: 500,
                status: 'error',
                message: `comment with keyword ${search} not found`,
                error: [],
              });
            }
          } else {
            const pagination = {
              currentPage: pageValue,
              dataPerPage: dataPerPage,
              totalPage: Math.ceil(totalData / limitValue),
            };

            success(res, {
              code: 200,
              status: 'success',
              message: `Success get all comment by recipe`,
              data: result.rows,
              pagination,
            });
          }
        } else {
          failed(res, {
            code: 400,
            status: 'error',
            message: 'limit and page value must be number',
            error: [],
          });
        }
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `recipe with id ${recipeid} not found`,
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

module.exports = commentController;
