const games = new Map();


function givePlayers(socket, uuid) {
    const game = games.get(uuid);

    if (game) {
        const msg = game.lobby_players.join(';');
        socket.emit('players list', msg);
    } else {
        console.log(uuid + ' does not exist');
    }
}

/* Server-side */
exports.handleEvents = function (io) {
    io.on('connection', socket => {
        console.log('User connected');

        socket.on('fetch players', uuid => {
            givePlayers(socket, uuid);
        });

        socket.on('join lobby', msg => {
            const msgs = msg.split(';');
            const uuid = msgs[0];
            const pseudo = msgs[1];

            let game = games.get(uuid);
            if (game) {
                game.lobby_players.push(pseudo);
            }
        });
    });
}

exports.handleJoin = function (uuid) {
    if (!games.has(uuid)) {
        let server_game = {
            lobby_players: [],
            game: null
        };

        games.set(uuid, server_game);
    }
}