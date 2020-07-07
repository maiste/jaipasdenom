/**
 * Main routes
 */

exports.home = (req, res) => {
    res.render("pages/home");
}

exports.game = (req, res) => {
    res.render("pages/game");
}

exports.lobby = (req, res) => {
    const gameNetwork = require('../president/game_network.js');
    gameNetwork.handleJoin(req.params.uuid);
    res.render("pages/lobby");
}