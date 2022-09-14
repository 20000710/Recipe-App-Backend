const db = require('../config/db');

const authModel = {
  register: (data) => {
    const {
      id,
      name,
      email,
      phone,
      passwordHashed,
      photo,
      level,
      verifyToken,
      isVerified,
      isActive,
    } = data;
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO users(id,name,email,phone,password,photo,level,verify_token,is_verified,is_active)
         VALUES ('${id}','${name}','${email}','${phone}','${passwordHashed}',
         '${photo}',${level},'${verifyToken}',${isVerified},${isActive})`,
        (err, res) => {
          if (err) {
            // reject(err);
            console.log(err);
          }
          resolve(res);
        },
      );
    });
  },
  findBy: (row, keyword) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users WHERE ${row}='${keyword}'`,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        },
      );
    });
  },
  verifyingEmail: (token) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET verify_token=NULL, is_active=true, is_verified=true WHERE verify_token='${token}'`,
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
module.exports = authModel;
