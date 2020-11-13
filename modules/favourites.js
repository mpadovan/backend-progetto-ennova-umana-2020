const { query } = require('express');
const { Component } = require('react');
const db = require('./db');
let connection;

module.exports = {
    //Query  per leggere tutti i preferiti di un utente
    getFavouritesByUserNickname: async (nickname) =>{
        queryFavouritesUser = await db.query('SELECT T2.title, T2.publishing_date,T2.director_name, ' + 
        'T2.views_count, T2.is_film, T2.genre, T2.media_description, T2.actors, T2.quality, T2.price, ' +
        'T2.available, T2.added_date, T2.media_image, T2.media_url FROM favourites as T1 ' + 
        'INNER JOIN media as T2 ON T1.media_title=T2.title AND T1.media_publishing_date=T2.publishing_date ' + 
        'WHERE user_nickname=?', [nickname]);
        return queryFavouritesUser;
    },
    
    //Query per creare nuovo favorito per l'utente
    setNewFavourite: async (nickname, title, publishing_date)  =>{
        await db.query('INSERT INTO favourites (user_nickname, media_title, media_publishing_date)'+
        ' VALUES(?, ?, ?) ', [nickname, title, publishing_date]);
        favouritesUser = favourites.getFavouritesByUserNickname(nickname);
        return favouritesUser;             
    }
}