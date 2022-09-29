const db = require('../config/db');

const selectAll = ({searchQuery, sortQuery, modeQuery}) => {
    return new Promise ((resolve, reject) => {
        db.query(`SELECT recipe.id, recipe.title, recipe.ingredients, recipe.is_active, users.name, recipe.created_at, recipe.liked, recipe.saved, recipe.popularity, recipe.video, recipe.photo
        FROM recipe 
        INNER JOIN users 
        ON recipe.user_id = users.id WHERE LOWER(title) LIKE '%${searchQuery}%' ORDER BY ${sortQuery} ${modeQuery}`,
        (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

const select = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT recipe.title, recipe.ingredients, recipe.is_active, users.name, recipe.created_at, recipe.liked, recipe.saved, recipe.popularity, recipe.video, recipe.photo
        FROM recipe 
        INNER JOIN users 
        ON recipe.user_id = users.id WHERE recipe.id='${id}'`, (err, res) => {
            if(err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    }); 
};

const latest = () => {
    return new Promise ((resolve, reject) => {
        db.query(`SELECT * from recipe ORDER BY created_at DESC LIMIT 1 OFFSET 0`, (err, res) => {
            if(err) {
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
};

const popular = () => {
    return new Promise ((resolve, reject) => {
        db.query(`SELECT * from recipe ORDER BY popularity DESC LIMIT 6 OFFSET 0`, (err, res) => {
            if(err) {
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
};

const insert = (data) => {
    const {id, title, ingredients, is_active, user_id, liked, saved, popularity, video, photo} = data
    return new Promise ((resolve, reject) =>
        db.query(`INSERT INTO recipe (id, title, ingredients, is_active, user_id, liked, saved, popularity, video, photo) VALUES ('${id}', '${title}', '${ingredients}', ${is_active}, '${user_id}', ${liked}, ${saved}, ${popularity}, '${video}', '${photo}')`, (error,result) => {
            if(!error){
                resolve(result)
            }else{
                reject(error)
            }
        })
    );
};

const update = (data) => {
    const {id, title, ingredients, is_active, user_id, liked, saved, popularity, video, photo} = data
    return new Promise((resolve, reject) => {
        db.query(`UPDATE recipe SET title='${title}', ingredients='${ingredients}', is_active=${is_active}, user_id='${user_id}', liked=${liked}, saved=${saved}, popularity=${popularity}, video='${video}', photo='${photo}' WHERE id='${id}'`,
        (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        },
      );
    });
};

const deleteRecipe = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `DELETE FROM recipe WHERE id='${id}'`,
            (err, res) => {
                if (err) {
                    reject(err);
                }else {
                    resolve(res);
                }
            },
        );
    });
};

const countRecipe = () => {
    return new Promise ((resolve, reject) => {
        db.query('SELECT COUNT(*) AS total FROM recipe', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = {
    selectAll,
    select,
    latest,
    popular,
    insert,
    update,
    deleteRecipe,
    countRecipe
}
