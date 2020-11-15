const mysql = require('mysql');
let connection;

module.exports = {
    //metodo per la connessione al database
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
     // metodo per eseguire query con parametri e non 
     query: async (_query, params) => {
         return new Promise((resolve, reject) => {
             connection.query(_query, params, (error, results) => {
                 if (error) reject(error);
                 else resolve(results);
             })
         })
     },
     //mostra l'id del thread in cui il db è in esecuzione 
     getThreadId: () => connection.threadId,
     //fa l'escape dei caratteri
     escape: (val) => mysql.escape(val)
}