const db = require('../config/db');

const authModel = {
  register: () => {},
  findBy: (row, keyword) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM user WHERE email='${email}'`, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },
  verifyingEmail: () => {},
};
module.exports = authModel;
