/**
 * App main file
 */

/* === Import === */
const app = require('express')();

const router = require('./routes');

app.set('view engine', 'ejs');


/* === Routing === */
app.get('/', router.home);


/* === Export === */
module.exports = app;