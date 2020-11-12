const mysql = require('mysql');
let connection;

module.exports = {
    connect: async (user, psw, db, host = 'localhost') => {
        return new Promise((resolve, reject) => {
            connection = mysql.createConnection({
                host: host,
                user: user,
                password: psw,
                database: db
            });
             connection.connect((err) => {
                 if (err) {
                     reject(err);
                 } else resolve();
             })
         })
     },
     query: async (_query, params) => {
         return new Promise((resolve, reject) => {
             connection.query(_query, params, (error, results) => {
                 if (error) reject(error);
                 else resolve(results);
             })
         })
     },
     getThreadId: () => connection.threadId
}