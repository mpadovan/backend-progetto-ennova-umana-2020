const express = require('express');
const app = express();
const port = 3000;
const db = require('./modules/db_manager');
const { body, validationResult, param } = require('express-validator');

app.use(express.static('./public'))
app.use(express.json());

let filter = async function (req, res, next) {
    let nickname;
    if(typeof req.params.nickname !== 'undefined') nickname = req.params.nickname
    else if(typeof req.body.nickname !== 'undefined') nickname = req.body.nickname
    else res.status(401).json({error: 'Unable to detect user nickname'});
    let result = await db.query('SELECT nickname, COUNT(nickname), is_completed FROM Users WHERE nickname = ?', [nickname])
    if (parseInt(result[0]['COUNT(nickname)']) > 0 && parseInt(result[0]['is_completed']) === 2) {
        req.isAuthorized = true;
    } else if (parseInt(result[0]['COUNT(nickname)']) > 0 && parseInt(result[0]['is_completed']) === 1) {
        try {
            await db.query('UPDATE Users SET is_completed = 2', [])
            if(typeof req.body.genres !== 'undefined' && req.body.genres.length !== 0) {
                for (let index = 0; index < req.body.genres.length; index++) {
                    await db.query('INSERT INTO GenresUsers(nickname, genre_name) VALUES (?, ?)', [nickname, req.body.genres[index].genre_name]);        
                }
            }
        } catch (error) {
            console.log(error);
        }
        req.isAuthorized = true;
    } else {
        try {
            await db.query('INSERT INTO Users(nickname, sign_on_date, is_completed) VALUES (?, NOW(), 1)', [nickname])
        } catch (error) {
            console.log(error);
        }
        req.isAuthorized = false;
    }
    next()
}

app.get('/', filter, (req, res) => {
    res.json()
})

app.get('/:nickname', filter, (req, res) => {
    res.send(req.isAuthorized);
});

app.get('/favourites/:nickname', filter, (req, res) => {

});

app.get('/details/:nickname/:title/:publishing_date', filter, (req, res) => {

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