const test = require('unit.js');
const gameModule = require('../../src/president/game.js');
const cardsModule = require('../../src/president/cards.js');

const two = ['P1', 'P2'];
const three = ['P1', 'P2', 'P3'];
const four = ['P1', 'P2', 'P3', 'P4'];
const five = ['P1', 'P2', 'P3', 'P4', 'P5'];

let two_g = gameModule.initGame('0', two);
let three_g = gameModule.initGame('1', three);
let four_g = gameModule.initGame('2', four);
let five_g = gameModule.initGame('3', five);

describe('Init game', function() {
    it('works', function() {
        test.assert(two_g.players.length === 2);
        test.assert(two_g.id === '0');

        test.assert(three_g.players.length === 3);
        test.assert(three_g.id === '1');

        test.assert(four_g.players.length === 4);
        test.assert(four_g.id === '2');

        test.assert(five_g.players.length === 5);
        test.assert(five_g.id === '3');
    });
});

describe('Distribute cards', function() {
    it('works', function() {
        gameModule.distributeCards(two_g);
        gameModule.distributeCards(three_g);
        gameModule.distributeCards(four_g);
        gameModule.distributeCards(five_g);

        test.assert(
            cardsModule.lengthCards(two_g.hands[0]) === 26 &&
            cardsModule.lengthCards(two_g.hands[1]) === 26
        );

        test.assert(
            cardsModule.lengthCards(three_g.hands[0]) === 18 &&
            cardsModule.lengthCards(three_g.hands[1]) === 17 &&
            cardsModule.lengthCards(three_g.hands[2]) === 17
        );

        test.assert(
            cardsModule.lengthCards(four_g.hands[0]) === 13 &&
            cardsModule.lengthCards(four_g.hands[1]) === 13 &&
            cardsModule.lengthCards(four_g.hands[2]) === 13 &&
            cardsModule.lengthCards(four_g.hands[3]) === 13
        );

        test.assert(
            cardsModule.lengthCards(five_g.hands[0]) === 11 &&
            cardsModule.lengthCards(five_g.hands[1]) === 11 &&
            cardsModule.lengthCards(five_g.hands[2]) === 10 &&
            cardsModule.lengthCards(five_g.hands[3]) === 10 &&
            cardsModule.lengthCards(five_g.hands[4]) === 10
        );
    });
});

describe('Finish game', function() {
    it('works', function() {
        test.assert(gameModule.finishGame(two_g) === false);

        let cards = cardsModule.cardsToList(two_g.hands[0]);
        cardsModule.removeCardsFromCards(two_g.hands[0], cards);

        test.assert(gameModule.finishGame(two_g) === true);

        cards.forEach(card => {
            cardsModule.addCardToCards(two_g.hands[0], card);
        });
    });
});

describe('Play one turn', function() {
    it('works', function() {
    });
});

describe('Player cards', function() {
    it('works', function() {
        cardsModule.addCardToCards(two_g.hands[0], '0x')
        test.assert(cardsModule.cardInCards(two_g.hands[0], '0x') === true);
        gameModule.playCards(two_g, 'P1', ['0x']);
        test.assert(cardsModule.cardInCards(two_g.hands[0], '0x') === false);
    });
});

describe('Play game', function() {
    it('works', function() {
    });
});