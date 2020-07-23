const config = require ('../config');
const Game = require ('./game.js');
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

function initGame (game) {
    let players = [];
    game.lobby_players.forEach(pl => {
        players.push(pl[0]);
    });
    game.game = Game.initGame(game.uuid, players);
    Game.distributeCards(game.game);
}

function sendGameInformation (game) {
    game.lobby_players.forEach(player => {
        const challengers = Game.getPlayerChallengers(game.game, player[0]);
        const middle = game.game.middle;
        const deck = Game.getPlayerHand(game.game, player[0]);

        const obj = {
            challengers: challengers,
            middle: middle,
            deck: deck,
            historic: game.game.historic
        };

        player[1].emit('update game', obj);
    });
}

function everyoneReady (game) {
    for (let i = 0; i<game.lobby_players.length; i++) {
        if (!game.lobby_players[i][2]) {
            return false;
        }
    }
    return true;
}

function readyGame (uuid, pseudo, socket) {
    let game = games.get(uuid);
    if (game) {
        for (let i = 0; i<game.lobby_players.length; i++) {
            if (game.lobby_players[i][0] === pseudo) {
                game.lobby_players[i][2] = true;
                game.lobby_players[i][1] = socket;
            }
        }

        if (everyoneReady(game)) {
            console.log('Everyone has joined ' + uuid);

            initGame(game);
            sendGameInformation(game);
        }
    }
}

function displayMessage(game, msg) {
    for (let i = 0; i < game.lobby_players.length; i++) {
        const socket = game.lobby_players[i][1];
        socket.emit('game error', msg);
    }
}

function handleError (game, exception) {
    switch (exception) {
        case 'not your turn':
            displayMessage(game, "This is not your turn!");
            return;
        case 'has stopped':
            displayMessage(game, "You are not in this turn anymore!");
            return;
        case 'not valid turn':
            displayMessage(game, "You can't play this!");
            return;
        default:
            console.log(exception);
            return;
    }
}
function playGame (uuid, pseudo, cards) {
    let game = games.get(uuid);
    try {
        if (game) {
            if (pseudo === Game.getCurrentPlayer(game.game)) {
                Game.playOneTurn (game.game, pseudo, cards);
                sendGameInformation(game);
            } else {
                throw 'not your turn';
            }
        }
    } catch (e) {
        handleError(game, e);
    }
}

exports.handleEvents = function (io) {
    io.on('connection', socket => {

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
            readyGame(obj.uuid, obj.pseudo, socket);
        });

        socket.on('play', obj => {
            playGame(obj.uuid, obj.pseudo, obj.cards);
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