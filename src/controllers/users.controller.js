// const userModel = require('../models/users.model');
const { success, failed } = require('../helpers/response');
const deleteFile = require('../helpers/deleteFile');
const usersModel = require('../models/users.model');

const userController = {
  usersAll: async (req, res) => {
    try {
      const { search, page, limit, sort, mode } = req.query;
      const searchQuery = search || '';
      const pageValue = page ? Number(page) : 1;
      const limitValue = limit ? Number(limit) : 5;
      const offsetValue = (pageValue - 1) * limitValue;
      const sortQuery = sort ? sort : 'name';
      const modeQuery = mode ? mode : 'ASC';
      if (typeof Number(page) == 'number' && typeof Number(limit) == 'number') {
        const allData = await usersModel.allData();
        const totalData = allData.rows[0].total;
        const result = await usersModel.usersAllData(
          searchQuery,
          offsetValue,
          limitValue,
          sortQuery,
          modeQuery,
        );
        if (search) {
          if (result.rowCount > 0) {
            const pagination = {
              currentPage: pageValue,
              dataPerPage: limitValue,
              totalPage: Math.ceil(result.rowCount / limitValue),
            };
            success(res, {
              code: 200,
              status: 'success',
              message: 'Success get all product',
              data: result.rows,
              pagination,
            });
          } else {
            failed(res, {
              code: 500,
              status: 'error',
              message: `product with keyword ${search} not found`,
              error: [],
            });
          }
        } else {
          const pagination = {
            currentPage: pageValue,
            dataPerPage: limitValue,
            totalPage: Math.ceil(totalData / limitValue),
          };

          success(res, {
            code: 200,
            status: 'success',
            message: `Success get all users`,
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
  usersDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await usersModel.detail(id);
      if (result.rowCount > 0) {
        success(res, {
          code: 200,
          status: 'success',
          message: 'Success get users by id',
          data: result.rows[0],
        });
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `users with id ${id} not found`,
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
  usersUpdate: async (req, res) => {
    try {
      const id = req.APP_DATA.tokenDecoded.id;
      const { name, phone } = req.body;
      const usersCheck = await usersModel.detail(id);
      if (usersCheck.rowCount > 0) {
        const data = {
          id,
          name,
          phone,
        };
        await usersModel.usersUpdateData(data);
        const newData = await usersModel.detail(id);
        success(res, {
          code: 200,
          status: 'success',
          message: 'Success update users',
          data: newData.rows[0],
        });
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
  usersUpdatePhoto: async (req, res) => {
    try {
      const id = req.APP_DATA.tokenDecoded.id;
      let photo;
      if (req.file) {
        const usersCheck = await usersModel.detail(id);
        if (usersCheck.rowCount > 0) {
          if (usersCheck.rows[0].photo == 'user_default.png') {
            photo = req.file.filename;
            const data = {
              id,
              photo,
            };
            await usersModel.usersUpdatePhotoData(data);
            const newData = await usersModel.detail(id);
            success(res, {
              code: 200,
              status: 'success',
              message: 'Success update users photo',
              data: newData.rows[0],
            });
          } else {
            deleteFile(`public/${usersCheck.rows[0].photo}`);
            photo = req.file.filename;
            const data = {
              id,
              photo,
            };
            await usersModel.usersUpdatePhotoData(data);
            const newData = await usersModel.detail(id);
            success(res, {
              code: 200,
              status: 'success',
              message: 'Success update users photo',
              data: newData.rows[0],
            });
          }
        } else {
          deleteFile(`public/${req.file.filename}`);
          failed(res, {
            code: 404,
            status: 'error',
            message: `users with id ${id} not found`,
            error: [],
          });
          return;
        }
      } else {
        failed(res, {
          code: 400,
          status: 'error',
          message: 'users photo is required',
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
  usersDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const detailUser = await usersModel.detail(id);
      if (detailUser.rowCount > 0) {
        deleteFile(`public/${detailUser.rows[0].photo}`);
        await usersModel.usersDeleteData(id);
        success(res, {
          code: 200,
          status: 'success',
          message: `success deleted users with id ${id}`,
          error: [],
        });
        return;
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
};

module.exports = userController;
