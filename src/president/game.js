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
    for (let i = 1; i < length; i++) {
        if (cardsModule.compare(first_card, cards[i]) !== 0) {
            return false;
        }
    }

    if (game.turn) {
        return game.turn === length;
    } else {
        game.turn = length;
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
    if (game.middle.length > 0 && game.middle[0] == "2") {
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

function playerCanPlay (game, player_index) {
    if (game.middle.length === 0 && game.hands[player].length > 0) {
        return true;
    }
    const hand = game.hands[player_index].sort(cardsModule.compare);
    const to_beat = game.middle[0];

    if (game.turn === 1) { //specific rule
        if (game.middle.length > 1 && (game.current_pl + 1 == player_index) ||
        (game.current_pl === game.players.length - 1 && player_index === 0)) {
            // If the player_index is the next player in the list and the last two cards are identicals:
            // he must play the same card of his turn is skipped
            if (cardsModule.compare(game.middle[0], game.middle[1]) === 0) {
                for (let i = 0; i < hand.length; i++) {
                    const card = hand[i];
                    if (cardsModule.compare(card, to_beat) === 0) {
                        return true;
                    }
                }
                return false;
            }
        }
    }

    let i = 0;
    while (i + game.turn < hand.length) {
        let b = true;

        const first_card = hand[i];
        for (let j = i + 1; (j < i + game.turn) && (j < hand.length - game.turn - 1); j++) {
            const card = hand[j];
            if (cardsModule.compare(card, to_beat) < 0 || cardsModule.compare(first_card, card) !== 0) {
                b = false;
            }
        }

        if (b) {
            return true;
        }
        i++;
    }

    return true;
}

function firstAvailable (game) {
    for (let i = game.current_pl + 1; i < game.players.length; i++) {
        if (playerCanPlay(game, i)) {
            return i;
        }
    }
    for (let i = 0; i <= game.current_pl; i++) {
        if (playerCanPlay(game, i)) {
            return i;
        }
    }
    return -1;
}

function nextPlayer (game) {
    if (closeTurn(game)) {
        const player_hand = game.hands[game.current_pl];
        if (player_hand.length === 0) {
            return firstAvailable(game);
        } else {
            return game.current_pl;
        }
    } else {
        return firstAvailable(game);
    }
}

function applyTurn (game, player, cards) {
    const next_player = nextPlayer(game);
    if (closeTurn(game) || next_player == game.current_pl) {
        game.turn = null;
        game.middle = [];
    } else {
        game.current_pl = next_player;
    }
    game.historic.push.apply(game.historic, [[player, cards]]);
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

/*
 * Allows the current player to play his turn.
 */
exports.playOneTurn = function (game, player, cards) {
    let hand = getPlayerHand(game, player);
    if (cardsInHand(game, hand, cards)) {
        if (validTurn(game, cards)) {
            updateMiddle(game, cards);
            cardsModule.removeCardsFromCards(hand, cards);
            applyTurn(game, player, cards);
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