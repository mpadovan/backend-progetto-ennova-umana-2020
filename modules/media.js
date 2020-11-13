const db = require('./db_manager')

module.exports = {
    //return i 20 media più popolari
    // @param isFilm se true ritorna i film, se false le serie, se null tutto
    getMostPopularMedias: async (isFilm = null) => {
        let conditions = '';
        if(isFilm === true) conditions+='WHERE is_film = true';
        else if(isFilm === false) conditions+='WHERE is_film = false';
        return await db.query('SELECT * FROM `media` '+ conditions + 'ORDER BY `views_count` ASC LIMIT 20');
    },
    //return i 20 media più popolari in base ai generi preferiti dell'utente
    // @param isFilm se true ritorna i film, se false le serie, se null tutto
    getTopMediasByGenre: async (nickname, isFilm = null) => {
        let conditions = '';
        if(isFilm === true) conditions+='AND is_film = true';
        else if(isFilm === false) conditions+='AND is_film = false';
        return await db.query('SELECT * FROM `media` INNER JOIN genresusers as gu ON gu.genre_name = media.genre WHERE gu.nickname = ? '+ conditions +' ORDER BY `views_count` ASC LIMIT 20', [nickname]); 
    },
    //return i 20 media più recenti
    // @param isFilm se true ritorna i film, se false le serie, se null tutto
    getNewReleases: async (isFilm = null) => {
        let conditions = '';
        if(isFilm === true) conditions+='WHERE is_film = true';
        else if(isFilm === false) conditions+='WHERE is_film = false';
        return await db.query('SELECT * FROM `media` '+ conditions + 'ORDER BY `added_date` ASC LIMIT 20');
    },
    //return i generi dell'utente
    // @param isFilm se true ritorna i film, se false le serie, se null tutto
    topGenresByNickname: async (nickname) => {
        return await db.query('SELECT * FROM `genresusers` WHERE `nickname` = ?', [nickname]);
    }
}