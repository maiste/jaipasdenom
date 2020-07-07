const games = new Map();


/* Server-side */
exports.handleEvents = function (io) {
    io.on('connection', socket => {
        console.log('User connected');
    });
}

exports.handleJoin = function (uuid) {
    if (!games.has(uuid)) {
        games.set(uuid, null);
    }
}