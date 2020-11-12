const { query } = require('express');
const { Component } = require('react');
const db = require('./db');
let connection;

module.exports = {
    //Query per leggere le rewiews di un determinato film
    getReviewsByMedia: async (publishing_date, title) =>{
        queryReviews = await db.query('SELECT comment FROM reviews WHERE media_title=? AND media_publishing_date=?',
        [title, publishing_date]);
        return queryReviews;
    },
    
    //Query che calcola la media dei rating
    calculateAvaregeRating: async (publishing_date, title) =>{
        queryRating = await db.query('SELECT AVG(rating) FROM reviews WHERE media_title=? AND media_publishing_date=?',
        [title, publishing_date]);
        return queryRating;
    },

    //Query che aggiunge il nuovo commento
    setNewReview: async (nickname, publishing_date, title, comment = "", rating) =>{
        if (comment.length<=140){
            await db.query('INSERT INTO reviews (rating, comment, user_nickname, media_title, media_publishing_date)'+
            ' VALUES(?, ?, ?, ?, ?) ', [rating, , comment, nickname, title, publishing_date]);
            queryNewReview = await db.query('SELECT comment, rating FROM reviews WHERE media_title=? '+
            'AND media_publishing_date=? AND user_nickname=?',
            [title, publishing_date, nickname]);
            return queryNewReview;
        }else {
            throw 'your comment exceeds 140 characters';
        }
        
    }
}