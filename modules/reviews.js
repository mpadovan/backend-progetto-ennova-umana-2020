const db = require('./db_manager');

module.exports = {
    //Query per leggere le rewiews di un determinato film
    getReviewsByMedia: async (publishing_date, title) =>{
        let queryReviews = await db.query('SELECT comment, rating, user_nickname FROM reviews WHERE media_title=? AND media_publishing_date=?',
        [title, new Date(publishing_date)]);
        return queryReviews;
    },
    
    //Query che calcola la media dei rating
    calculateAvaregeRating: async (publishing_date, title) =>{
        let queryRating = await db.query('SELECT AVG(rating) FROM reviews WHERE media_title=? AND media_publishing_date=?',
        [title, new Date(publishing_date)]);
        console.log(queryRating);
        return queryRating[0]['AVG(rating)'];
    },

    //Query che aggiunge il nuovo commento
    setNewReview: async (nickname, publishing_date, title, comment = "", rating) =>{
        if (comment.length<=140){
            await db.query('INSERT INTO reviews (rating, comment, user_nickname, media_title, media_publishing_date)'+
            ' VALUES(?, ?, ?, ?, ?) ', [rating, comment, nickname, title, new Date(publishing_date)]);
            return module.exports.getReviewsByMedia(publishing_date, title);
        }else {
            throw 'your comment exceeds 140 characters';
        }
        
    }
}