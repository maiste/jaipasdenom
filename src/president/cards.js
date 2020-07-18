exports.deck_json =
`{
  "colors" : ["c","d","h","s"],
  "cards" : ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]
}`

exports.deck = {
  colors : ["c","d","h","s"],
  cards : ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]
}

const RANDOM_MIX = 3;

/*
 * Create a list of card, from the cards described in the object.
 */
exports.initCards = function (object) {
  const colors = object.colors;
  const cards = object.cards;

  let deck = [];
  colors.forEach(color => {
    cards.forEach(card => {
      deck.push(card + color);
    })
  });
  return deck;
}

/*
 * Return the empty list of card.
 */
exports.emptyCards = function () {
  return [];
}

/*
 * Return true if the list of card is empty.
 */
exports.isEmptyCards = function (cards) {
  return cards.length === 0;
}

/*
 * Remove card from cards,
 * if the card is not in the cards, nothing happens.
 */
exports.removeCardFromCards = function (cards, card) {
  const index = cards.indexOf(card);
  if (index > -1) {
    cards.splice(index, 1);
  }
}

/*
 * Remove cards from the cards,
 * if the cards are not in the cards, nothing happens.
 */
exports.removeCardsFromCards = function (cards, to_remove) {
  to_remove.forEach(card => exports.removeCardFromCards(cards, card));
}

/*
 * Add card to the cards.
 */
exports.addCardToCards = function (cards, card) {
  cards.push(card);
}

/*
 * Add cards to the cards.
 */
exports.addCardsToCards = function (deck, cards) {
  cards.forEach(card => exports.addCardToCards(deck, card));
}

/*
 * Mix the cards.
 */
exports.mixCards = function (cards) {
  for(let k=RANDOM_MIX; k>0; k--){
    for(let i=0; i<cards.length; i++){
      const x = Math.floor(Math.random() * (cards.length - 2) + 2);
      const tmp = cards[0];
      cards[0] = cards[x];
      cards[x] = tmp;
    }
  }
}

/*
 * Pop a card from the cards,
 * must not be empty
 */
exports.popCard = function (cards) {
  return cards.pop();
}

/*
 * Returns how many cards.
 */
exports.lengthCards = function (cards) {
    return cards.length;
}

/*
 * Return the cards as a card array.
 */
exports.cardsToList = function (cards) {
    return cards.slice();
}

/*
 * Return true if the card is in the cards.
 */
exports.cardInCards = function (cards, card) {
    return cards.includes(card);
}

exports.compare = function (card1, card2) {
  function cardToInt(card) {
    switch(card[0]) {
        case "J":
            return 11;
        case "Q":
            return 12;
        case "K":
            return 13
        case "A":
            return 14
        default:
            return parseInt(card);
    }
  }
  return cardToInt(c1) - cardToInt(c2);
}