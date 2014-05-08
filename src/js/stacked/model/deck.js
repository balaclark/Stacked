
Stacked.Model.Deck = Backbone.Model.extend({

  defaults: {
    decks: 1,
    type: Stacked.Model.Type.Base,
    cards: null
  },

  initialize: function (attributes) {
    var type = attributes.type || this.get('type');
    this.set({ set: new type });
    this.replenish();
  },

  replenish: function () {

    var type = this.get('type'),
      set = new type,
      cards = new Stacked.Collection.Cards();

    for (var i = 0; i < this.get('decks'); i++) {
      _.each(set.get('suits'), function (suit) {
        _.each(set.get('cards'), function (card, value) {
          cards.add({ type: type, suit: suit, value: value });
        });
      });
    }

    this.set({ cards: cards });
  },

  shuffle: function () {

    var cards = [];

    this.get('cards').shuffle().forEach(function (card) {
      cards.push(card);
    });

    this.get('cards').reset(cards);
  },

  pop: function () {
    var card = this.get('cards').last();
    this.get('cards').remove(card);
    return card;
  }
});
