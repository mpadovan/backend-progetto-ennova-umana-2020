const db = require('./db_manager');

module.exports = {
    //Query  per leggere tutti i preferiti di un utente
    getFavouritesByUserNickname: async (nickname) => {
        let queryFavouritesUser = await db.query('SELECT T2.title, T2.publishing_date,T2.director_name, ' +
            'T2.views_count, T2.is_film, T2.genre, T2.media_description, T2.actors, T2.quality, T2.price, ' +
            'T2.available, T2.added_date, T2.media_image, T2.media_url FROM favourites as T1 ' +
            'INNER JOIN media as T2 ON T1.media_title=T2.title AND T1.media_publishing_date=T2.publishing_date ' +
            'WHERE user_nickname=?', [nickname]);
        return queryFavouritesUser;
    },

    isFavouriteByUserNickname: async (nickname, publishing_date, title) => {
        let queryFavouritesUser = await db.query('SELECT T2.title, T2.publishing_date,T2.director_name, ' +
            'T2.views_count, T2.is_film, T2.genre, T2.media_description, T2.actors, T2.quality, T2.price, ' +
            'T2.available, T2.added_date, T2.media_image, T2.media_url FROM favourites as T1 ' +
            'INNER JOIN media as T2 ON T1.media_title=T2.title AND T1.media_publishing_date=T2.publishing_date ' +
            'WHERE user_nickname=? AND T2.title = ? AND T2.publishing_date = ?', [nickname, title, new Date(publishing_date)]);
        return queryFavouritesUser.length;
    },

    //Query per creare nuovo favorito per l'utente
    setNewFavourite: async (nickname, title, publishing_date) => {
        try {
            await db.query('INSERT INTO favourites (user_nickname, media_title, media_publishing_date)' +
                ' VALUES(?, ?, ?) ', [nickname, title, new Date(publishing_date)]);
            return true;
        } catch (error) {
            throw error;
        }
    }
}