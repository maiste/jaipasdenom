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
app.get('/lobby/:uuid([0-9 a-f]{8}-[0-9 a-f]{4}-[0-9 a-f]{4}-[0-9 a-f]{4}-[0-9 a-f]{12})', router.lobby);
app.get('/lobby', router.lobby);

/* === Export === */
module.exports = app;