/**
 * Manage server configuration
 */

const http = require('http');
const app = require('./app');
const config = require('./config');

const server = http.createServer(app);

console.log("Server is listening on " + config.port);
server.listen(config.port);
