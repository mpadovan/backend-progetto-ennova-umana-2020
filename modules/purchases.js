const db = require('./db_manager');

module.exports = {
    //Query di controllo se l’acquisto è stato già effetuato
    checkPurchase: async (nickname, title, publishing_date) => {
        let queryControl = await db.query('SELECT COUNT(*) FROM purchases WHERE user_nickname=? AND ' +
            'media_title=? AND media_publishing_date=?', [nickname, title, new Date(publishing_date)]);
        console.log(queryControl)
        if (parseInt(queryControl[0]['COUNT(*)']) === 0) {
            return false;
        }
        return true;
    },

    //Query per inserire l’acquisto dell’ utente
    setNewPurchase: async (nickname, title, publishing_date) => {
        let checkPurchaseUser = await module.exports.checkPurchase(nickname, title, publishing_date);
        if (!checkPurchaseUser) {
            let price = await db.query('SELECT price FROM media WHERE title = ? AND publishing_date = ?', [title, new Date(publishing_date)]);
            try {
                await db.query('INSERT INTO purchases (purchase_date, purchase_price, user_nickname, media_title, ' +
                    'media_publishing_date) VALUES(NOW(), ?, ?, ?, ?) ', [price[0].price, nickname, title, new Date(publishing_date)]);
                return true;
            } catch (error) {
                throw error
            }
        } else {
            throw 'you have already purchased this item';
        }
    },

    //Query che ritorna tutti gli acquisti dell’ utente
    getPurchesesByUserNickname: async (nickname) => {
        queryPurchasesUser = await db.query('SELECT T2.title, T2.publishing_date,T2.director_name, ' +
            'T2.views_count, T2.is_film, T2.genre, T2.media_description, T2.actors, T2.quality, T2.price, ' +
            'T2.available, T2.added_date, T2.media_image, T2.media_url FROM purchases as T1 ' +
            'INNER JOIN media as T2 ON T1.media_title=T2.title AND T1.media_publishing_date=T2.publishing_date ' +
            'WHERE user_nickname=?', [nickname]);
        return queryPurchasesUser;
    }
}