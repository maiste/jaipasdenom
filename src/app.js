/**
 * App main file
 */

/* === Import === */
const express = require('express');
const app = express();
const path = require('path');

const router = require('./routes');

app.use('/public', express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');


/* === Routing === */
app.get('/', router.home);
app.get('/game', router.game);
app.get('/lobby', router.lobby);


/* === Export === */
module.exports = app;