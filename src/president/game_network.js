const config = require ('../config');
const games = new Map();

/* Server-side */

function givePlayers (socket, uuid) {
    const game = games.get(uuid);

    if (game) {
        let players = []
        game.lobby_players.forEach(player => {
            players.push(player[0]);
        });
        const msg = players.join(';');

        socket.emit('players list', msg);
    } else {
        console.log(uuid + ' does not exist');
    }
}

function updateSocket (game, socket, pseudo) {
    for (let i = 0; i < game.lobby_players.length; i++) {
        if (game.lobby_players[i][0] === pseudo) {
            game.lobby_players[i][1] = socket;
            return true;
        }
    }
    return false;
}

function joinPlayer (socket, uuid, pseudo) {
    let game = games.get(uuid);
    if (game && !updateSocket(game, socket, pseudo)) {
        game.lobby_players.push([pseudo, socket, false]);

        game.lobby_players.forEach(x => {
            const pseudo_tmp = x[0];
            const socket = x[1];

            if (pseudo !== pseudo_tmp) {
                givePlayers(socket, uuid);
            }
        });
    }
}

function startGame (uuid) {
    let game = games.get(uuid);
    if (game) {
        game.lobby_players.forEach(x => {
            const socket = x[1];

            const url = config.url + 'game/' + uuid;
            socket.emit('join game', url);
        });
    }
}

function everyoneReady (game) {
    for (let i = 0; i<game.lobby_players.length; i++) {
        if (!game.lobby_players[i][2]) {
            return false;
        }
    }
    return true;
}

function readyGame (uuid, pseudo) {
    let game = games.get(uuid);
    if (game) {
        for (let i = 0; i<game.lobby_players.length; i++) {
            if (game.lobby_players[i][0] === pseudo) {
                game.lobby_players[i][2] = true;
            }
        }

        if (everyoneReady(game)) {
            // initGame();
            // sendGameInformation();
        }
    }
}

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
            joinPlayer(socket, uuid, pseudo);
        });

        socket.on('start game', uuid => {
            startGame(uuid);
        });

        socket.on('ready game', obj => {
            readyGame(obj.uuid, obj.pseudo);
        });
    });
}

exports.handleJoin = function (uuid) {
    if (!games.has(uuid)) {
        let server_game = {
            lobby_players: [],
            sockets: [],
            game: null
        };

        games.set(uuid, server_game);
    }
}