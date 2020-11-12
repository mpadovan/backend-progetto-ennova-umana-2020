const { query } = require('express');
const { Component } = require('react');
const db = require('./db');
let connection;

module.exports = {
    //Query  per leggere tutti i preferiti di un utente
    getFavouritesByUserNickname: async (nickname) =>{
        queryFavouritesUser = await db.query('SELECT media_title, media_publishing_date FROM favourites ' + 
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