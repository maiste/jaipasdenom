const test = require('unit.js');
const cardsModule = require('../../src/president/cards.js');

const deck1_json =
`{
    "colors" : ["s", "h"],
    "cards" : ["1", "2", "3"]
}`

const deck1 = {
    colors : ["s", "h"],
    cards : ["1", "2", "3"]
}

describe('Init cards', function() {
    it('works', function() {
        const deck = cardsModule.initCards(deck1);

        const cards = [
            "1s",
            "2s",
            "3s",
            "1h",
            "2h",
            "3h"
        ];

        deck.forEach(card => {
            test.assert(cardsModule.cardInCards(deck, card) === true); 
        });
    });
});

describe('Empty cards', function () {
    it('works', function () {
       const good = cardsModule.emptyCards();
       const bad = cardsModule.emptyCards();

       cardsModule.addCardToCards(bad, '1s');

       test.assert(cardsModule.isEmptyCards(good) === true);
       test.assert(cardsModule.isEmptyCards(bad) === false);
    });
});

describe('Remove card', function () {
    it('works', function() {
        let deck = cardsModule.initCards(deck1);

        const good = "1s";
        const bad = "1x";

        test.assert(cardsModule.cardInCards(deck, good) === true);
        test.assert(cardsModule.cardInCards(deck, bad) === false);

        cardsModule.removeCardFromCards(deck, good);
        cardsModule.removeCardFromCards(deck, bad);

        test.assert(cardsModule.cardInCards(deck, good) === false);
        test.assert(cardsModule.cardInCards(deck, bad) === false);
    });
});

describe('Remove cards', function () {
    it('works', function() {
        let deck = cardsModule.initCards(deck1);
        const to_pick = ['1s', '2s'];

        to_pick.forEach(card => {
            test.assert(cardsModule.cardInCards(deck, card) === true);
        });

        cardsModule.removeCardsFromCards(deck, to_pick);

        to_pick.forEach(card => {
            test.assert(cardsModule.cardInCards(deck, card) === false);
        });
    });
});

describe('Add card', function () {
    it('works', function() {
        let deck = cardsModule.emptyCards();
        const card = "1s";

        test.assert(cardsModule.cardInCards(deck, card) === false);
        cardsModule.addCardToCards(deck, card);
        test.assert(cardsModule.cardInCards(deck, card) === true);
    });
});

describe('Add cards', function () {
    it('works', function() {
        let deck = cardsModule.emptyCards();
        const cards = ['1s', '2s', '3s'];

        cards.forEach(card => {
            test.assert(cardsModule.cardInCards(deck, card) === false);
        });

        cardsModule.addCardsToCards(deck, cards);

        cards.forEach(card => {
            test.assert(cardsModule.cardInCards(deck, card) === true);
        });
    });
});

describe('Mix cards', function () {
    it('works', function() {
        let deck = cardsModule.initCards(deck1);
        let copy = deck.slice();

        cardsModule.mixCards(deck);

        let same = true;
        for(let i=0; i<deck.length; i++) {
            if(deck[i] != copy[i]) {
                same = false;
            }
        }

        test.assert(same === false);
    });
});

describe('Pop from cards', function () {
    it('works', function() {
        let good = cardsModule.emptyCards();
        let bad = cardsModule.emptyCards();

        cardsModule.addCardToCards(good, '1s');
        cardsModule.addCardToCards(good, '13s');

        const card1 = cardsModule.popCard(good);
        const card2 = cardsModule.popCard(good);

        test.assert(card1 === '13s');
        test.assert(card2 === '1s');

        try {
            cardsModule.popCard(bad);
            test.assert(true === false);
        } catch(error) {
        }
    });
});

describe('Length cards',  function () {
    it('works', function() {
        let hand = cardsModule.emptyCards();
        test.assert(cardsModule.lengthCards(hand) === 0);
        cardsModule.addCardToCards(hand, '1s');
        test.assert(cardsModule.lengthCards(hand) === 1);
        cardsModule.removeCardFromCards(hand, '1s');
        test.assert(cardsModule.lengthCards(hand) === 0);
    });
});