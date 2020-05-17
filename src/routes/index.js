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
    res.render("pages/lobby");
}