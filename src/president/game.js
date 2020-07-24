const cardsModule = require ('./cards.js');

/*
 * Create a game object.
 */
exports.initGame = function (id, players) {
    let deck = cardsModule.initCards(cardsModule.deck);
    
    let game = {
        id: id, //unique identifier
        players: players, //array of players names
        hands: [], //array of players hands
        // TODO: Current player depends on the rule
        current_pl: 0, //index of the current player
        deck: deck, //deck of the game
        historic: [], //historic of played cards
        middle: [], //current cards on the board
        turn: null, //turn mode: 1/2/3/4 cards
        skip: false, //indicate if the next player might be skipped
        stopped: [], //players that skipped the current turn
        last_to_play: null //last player to play a card
    }
    cardsModule.mixCards(game.deck);
    
    for(let i=0; i<game.players.length; i++) {
        game.hands[i] = cardsModule.emptyCards();
    }

    return game;
}

/*
 * Distribute the cards to each player.
 */
exports.distributeCards = function (game) {
    let ind = 0;
    while(!cardsModule.isEmptyCards(game.deck)){
        const card = cardsModule.popCard(game.deck);
        cardsModule.addCardToCards(game.hands[ind], card);
        ++ind;
        ind = ind%game.players.length;
    }
}

/*
 * Return true if the game is finished
 */
exports.finishGame = function (game) {
    let players_left = game.players.length;
    
    game.hands.forEach(hand => {
        if(cardsModule.lengthCards(hand) === 0) {
            players_left--;
        }
    });

    return players_left <= 1;
}

/*
 * Check if the player's hand has all the cards
 */
function cardsInHand (game, hand, cards) {
    for (let i = 0; i < cards.length; i++) {
        if (!cardsModule.cardInCards(hand, cards[i])) {
            return false;
        }
    }
    return true;
}

/*
 * Check if the turn is valid based on previous turn
 */
function validTurn (game, cards) {
    const length = cards.length;

    const first_card = cards[0];

    if (game.skip) {
        if (cardsModule.compare(first_card, game.middle[0]) !== 0) {
            return false;
        }
    }

    for (let i = 1; i < length; i++) {
        if (cardsModule.compare(first_card, cards[i]) !== 0) {
            return false;
        }
    }

    if (game.turn) {
        return game.turn === length;
    } else {
        return true;
    }
}

/*
 * Update the middle
 */
function updateMiddle (game, cards) {
    let tmp = cards.slice();
    tmp.push.apply(tmp, game.middle);
    game.middle = tmp;
}

function closeTurn (game) {
    if (game.middle.length > 0 && cardsModule.compare(game.middle[0], "2d") === 0) {
        return true;
    }
    if (game.middle.length >= 4) {
        const card = game.middle[0];
        let ok = true;
        for (let i = 1; i < 4; i++) {
            if (cardsModule.compare(card, game.middle[i]) !== 0) {
                ok = false;
            }
        }
        if (ok) {
            return true;
        }
    }

    return false;
}

function firstWithCards (game, start) {
    for (let i = start + 1; i < game.players.length; i++) {
        if (!hasStopped(game, game.players[i])) {
            return i;
        }
    }
    for (let i = 0; i <= start; i++) {
        if (!hasStopped(game, game.players[i])) {
            return i;
        }
    }
    return -1;
}

function nextPlayer (game) {
    if (closeTurn(game)) {
        const ind = game.players.indexOf(game.last_to_play);
        const player_hand = game.hands[ind];
        if (hasStopped(game, game.last_to_play)) {
            return firstWithCards(game, ind);
        } else {
            return ind;
        }
    } else {
        return firstWithCards(game, game.current_pl);
    }
}

function applyTurn (game, player, cards) {
    if (!game.turn) {
        game.turn = cards.length;
    }
    if (cards.length === 1 && game.middle.length > 0) {
        if (cardsModule.compare(cards[0], game.middle[0]) === 0) {
            game.skip = true;
        }
    }
    if (cards.length > 0) {
        let acc = player + ":";
        cards.forEach(card => {
            acc += " " + card;
        });
        game.historic.push(acc);
    }

    updateMiddle(game, cards);
    if (game.hands[game.players.indexOf(game.last_to_play)].length - cards.length === 0) {
        game.stopped.push(game.last_to_play);
    }

    const next_player = nextPlayer(game);
    console.log(next_player);
    if (closeTurn(game) || game.players[next_player] === game.last_to_play) {
        game.turn = null;
        game.middle = [];
        game.current_pl = next_player;
        game.historic.push(game.last_to_play + " closed the turn!");
        game.last_to_play = null;
        game.skip = false;
        game.stopped = [];
        for (let i = 0; i < game.hands.length; i++) {
            if (game.hands[i].length === 0) {
                game.stopped.push(game.players[i]);
            }
        }
    } else {
        game.current_pl = next_player;
    }
}

/*
 * Get player's hand
*/
function getPlayerHand (game, player) {
    let index = -1;
    let tmp = 0;
    game.players.forEach(pl => {
        if (pl === player) {
            index = tmp;
        }
        tmp++;
    });

    if (index > -1) {
        return game.hands[index];
    }
    return [];
}

exports.getPlayerHand = getPlayerHand;

function hasStopped(game, player) {
    for (let i = 0; i < game.stopped.length; i ++) {
        if (game.stopped[i] === player) {
            return true;
        }
    }
    return false;
}
/*
 * Allows the current player to play his turn.
 */
exports.playOneTurn = function (game, player, cards) {
    if (hasStopped(game, player)) {
        throw 'has stopped';
    }

    if (cards.length === 0) {
        if (game.middle.length === 0) {
            return; // can't skip if it's empty
        }
        if (!game.skip) {
            game.historic.push(player + " stop for this turn!");
            game.stopped.push(player);
        } else {
            game.historic.push(player + " is skipped!");
        }
        game.skip = false;
        applyTurn(game, player, cards);
        return;
    }

    let hand = getPlayerHand(game, player);
    if (cardsInHand(game, hand, cards)) {
        if (validTurn(game, cards)) {
            game.last_to_play = player;
            applyTurn(game, player, cards);
            cardsModule.removeCardsFromCards(hand, cards);
        } else {
            throw 'not valid turn';
        }
    }
}

/*
 * Player plays cards, remove them from his hands.
 */
exports.playCards = function (game, player, cards) {
    const index = game.players.indexOf(player);
    if(index < 0) {
        return;
    }
    cardsModule.removeCardsFromCards(game.hands[index], cards);
}

/*
 * Play the game until the game has finished.
 */
exports.playGame = function (game) {
    while(!finishGame(game)) {
        playOneTurn(game);
        // game.current_pl = (++game.current_pl)%game.players.length;
    }
}

/**
 * Get player's challengers
 */
exports.getPlayerChallengers = function (game, player) {
    let challengers = [];

    let index = 0;
    game.players.forEach(pl => {
        if (pl !== player) {
            challengers.push([pl, game.hands[index].length]);
        }
        index++;
    })

    return challengers;
}

/**
 * Get current player
 */
exports.getCurrentPlayer = function (game) {
    return game.players[game.current_pl];
}