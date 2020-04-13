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
        deck: deck //deck of the game
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
 * Allows the current player to play his turn.
 */
exports.playOneTurn = function (game) {
    throw "TODO";
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
        game.current_pl = (++game.current_pl)%game.players.length;
    }
}