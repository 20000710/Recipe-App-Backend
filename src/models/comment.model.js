const db = require('../config/db');

const commentModel = {
  allData: () => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) AS total FROM comment`, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  commentAllData: (
    searchQuery,
    offsetValue,
    limitValue,
    sortQuery,
    modeQuery,
  ) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM comment WHERE LOWER(comment_text) LIKE '%${searchQuery}%'
      ORDER BY ${sortQuery} ${modeQuery} LIMIT ${limitValue} OFFSET ${offsetValue}`,
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
  commentAddData: (data) => {
    const { id, recipeId, usersId, commentText } = data;
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO comment (id,recipe_id,user_id,comment_text)
      VALUES ('${id}','${recipeId}','${usersId}','${commentText}')`,
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
  commentDetailData: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `
      SELECT * FROM comment WHERE id='${id}'
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
  commentUpdateData: (id, commentText) => {
    return new Promise((resolve, reject) => {
      db.query(
        `
        UPDATE comment set comment_text='${commentText}' WHERE id='${id}'
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
  commentDeleteData: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `
        DELETE FROM comment WHERE id='${id}'
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
  allDataByRecipe: (recipeId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT COUNT(*) AS total FROM comment WHERE recipe_id='${recipeId}'`,
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
  commentAllDataByRecipe: (
    searchQuery,
    offsetValue,
    limitValue,
    sortQuery,
    modeQuery,
    recipeId,
  ) => {
    return new Promise((resolve, reject) => {
      db.query(
        `
        SELECT comment.id AS commentId, comment.comment_text AS commentText, comment.created_at AS commentTime, comment.recipe_id AS commentRecipeId,
        users.id AS usersId, users.photo AS usersPhoto, users.name AS usersName
        FROM comment INNER JOIN users ON comment.user_id=users.id WHERE LOWER(comment.comment_text) LIKE '%${searchQuery}%'
        AND comment.recipe_id='${recipeId}' ORDER BY ${sortQuery} ${modeQuery} LIMIT ${limitValue} OFFSET ${offsetValue}
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
  recipeCheck: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM recipe WHERE id='${id}'`, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
};

module.exports = commentModel;
