const { failed } = require('../helper/response');

module.exports = {
  isCreator: (req, res, next) => {
    if (req.APP_DATA.tokenDecoded.level === 0) {
      next();
    } else {
      failed(res, {
        code: 401,
        status: 'failed',
        message: 'user dont have access',
        error: [],
      });
    }
  },
  isNotCreator: (req, res, next) => {
    if (req.APP_DATA.tokenDecoded.level === 1) {
      next();
    } else {
      failed(res, {
        code: 401,
        status: 'failed',
        message: 'user dont have access',
        error: [],
      });
    }
  },
};
