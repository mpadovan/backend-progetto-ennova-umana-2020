//richiesta moduli interni ed esterni
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const db = require('./modules/db_manager');
const Media = require('./modules/media');
const Reviews = require('./modules/reviews');
const Favourites = require('./modules/favourites');
const Purchases = require('./modules/purchases');

app.use(cors());
app.use(express.static('./public'));
app.use(express.json());
 
// dichiarazione filtro di login:
// un utente non registrato ha stato (is_completed) di default 0
// appena viene registrato per la prima volta ha stato (is_completed) = 1
// da quando ha uno stato = 1 può inserire i propri generi preferiti, se non inserisce generi la procedura continua
// il suo stato viene incrementato a 2, da qui in poi lo stato non viene più variato
let filter = async function (req, res, next) {
    let nickname;
    if(typeof req.params.nickname !== 'undefined') nickname = req.params.nickname
    else if(typeof req.body.nickname !== 'undefined') nickname = req.body.nickname
    else res.status(401).json({error: 'Unable to detect user nickname'});
    req.nickname = nickname;
    let result = await db.query('SELECT nickname, COUNT(nickname), is_completed FROM users WHERE nickname = ?', [nickname])
    if (parseInt(result[0]['COUNT(nickname)']) > 0 && parseInt(result[0]['is_completed']) === 2) {
        req.isAuthorized = true;
    } else if (parseInt(result[0]['COUNT(nickname)']) > 0 && parseInt(result[0]['is_completed']) === 1) {
        try {
            await db.query('UPDATE users SET is_completed = 2', [])
            if(typeof req.body.genres !== 'undefined' && req.body.genres.length !== 0) {
                for (let index = 0; index < req.body.genres.length; index++) {
                    await db.query('INSERT INTO genresusers(nickname, genre_name) VALUES (?, ?)', [nickname, req.body.genres[index].genre_name]);        
                }
            }
        } catch (error) {
            console.log(error);
        }
        req.isAuthorized = true;
    } else {
        try {
            await db.query('INSERT INTO users(nickname, sign_on_date, is_completed) VALUES (?, NOW(), 1)', [nickname])
        } catch (error) {
            console.log(error);
        }
        req.isAuthorized = false;
    }
    next()
}
//endpoint per l'home, vengono spediti al client i media più popolari, 
//i più popolari in base ai suoi generi preferiti e le nuove uscite
app.get('/:nickname', filter, async (req, res) => {
    let a = await Promise.all([Media.getMostPopularMedias(), Media.getTopMediasByGenre(req.nickname), Media.getNewReleases()]);
    let obj = {
        popular: a[0],
        topByGenre: a[1],
        newReleases: a[2]
    }
    res.json(obj);
});

app.post('/favourite/:nickname/:title/:publishing_date', filter, async (req, res) => {
    try {
        const favourite = await Favourites.setNewFavourite(req.params.nickname, req.params.title, req.params.publishing_date)
        res.json({favourite: favourite, title: req.params.title, publishing_date: req.params.publishing_date});
    } catch (error) {
        res.json({error: error, title: req.params.title, publishing_date: req.params.publishing_date});
    }
});

app.get('/is_favourite/:nickname/:title/:publishing_date', filter, async (req, res) => {
    res.json({isFav: await Favourites.isFavouriteByUserNickname(req.params.nickname, req.params.publishing_date, req.params.title), title: req.params.title, publishing_date: req.params.publishing_date});
});

app.get('/reviews/:nickname/:title/:publishing_date', filter, async (req, res) => {
    res.json({reviews: await Reviews.getReviewsByMedia(req.params.publishing_date, req.params.title), title: req.params.title, publishing_date: req.params.publishing_date});
});

app.post('/rating/:nickname/:title/:publishing_date', filter, async (req, res) => {
    try {
        const reviews = await Reviews.setNewReview(req.params.nickname, req.params.publishing_date, req.params.title, req.body.comment != undefined ? req.body.comment : '', req.body.rating)
        res.json({reviews: reviews, title: req.params.title, publishing_date: req.params.publishing_date});
    } catch (error) {
        res.json({error: error, title: req.params.title, publishing_date: req.params.publishing_date});
    }
});

app.get('/has_purchased/:nickname/:title/:publishing_date', filter, async (req, res) => {
    res.json({bought: await Purchases.checkPurchase(req.params.nickname, req.params.title, req.params.publishing_date), title: req.params.title, publishing_date: req.params.publishing_date});
});

app.post('/purchase/:nickname/:title/:publishing_date', filter, async (req, res) => {
    try {
        const purchase = await Purchases.setNewPurchase(req.params.nickname, req.params.title, req.params.publishing_date)
        res.json({purchase: purchase, title: req.params.title, publishing_date: req.params.publishing_date});
    } catch (error) {
        res.json({error: error, title: req.params.title, publishing_date: req.params.publishing_date});
    }
});

//restituisce il ratin gmedio per ogni media
app.get('/rating/:nickname/:title/:publishing_date', filter, async (req, res) => {
    res.json({avg: await Reviews.calculateAvaregeRating(req.params.publishing_date, req.params.title), title: req.params.title, publishing_date: req.params.publishing_date});
});

/*
app.get('/', async (req, res) => {
    res.send('Hello World!');
})

app.get('/saluta/:persona', (req, res) => {
    res.send('Ciaone a quel fiol di ' + req.params.persona);
})

app.get('/examples', async (req, res) => {
    try {
        const c = await db.query('select * from example', []);
        res.status(200);
        res.json(c);
    } catch (error) {
        res.status(500);
        res.send('server error');
    }
})
app.put('/examples/:id',
[
    param("id").isLength({ min: 1 }),
    body("title").isString(),
    body("description").isString(),
],async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        await db.query('INSERT INTO example (id, title, description) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE title=?, description=?', [req.params.id, req.body.title, req.body.description, req.body.title, req.body.description, req.params.id]);
        res.status(200);
        res.json({res:'PUT completed'});
    } catch (error) {
        console.log(error)
        res.status(500);
        res.send('server error');
    }
})

app.delete('/examples/:id', async (req, res) => {
    try {
        await db.query('delete from example where id = ?', [req.params.id]);
        res.status(200);
        res.json({res:'DELETE completed'});
    } catch (error) {
        console.log(error)
        res.status(500);
        res.send('server error');
    }
});
*/
app.listen(port, async () => {
    await db.connect('progetto', '', 'progetto_ennova_umana', '192.168.64.2');
    console.log('db connected with id: ' + db.getThreadId())
    console.log(`express listening at localhost: ${port}`);
}) 