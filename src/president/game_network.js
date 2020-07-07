const games = new Map();


function givePlayers(socket, uuid) {
    socket.emit('players list', 'TODO1;TODO2');
}

/* Server-side */
exports.handleEvents = function (io) {
    io.on('connection', socket => {
        console.log('User connected');

        socket.on('fetch players', uuid => {
            givePlayers(socket, uuid);
        });
    });
}

exports.handleJoin = function (uuid) {
    if (!games.has(uuid)) {
        games.set(uuid, null);
    }
}