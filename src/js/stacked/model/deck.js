
Stacked.Model.Deck = Backbone.Model.extend({

  defaults: {
    decks: 1,
    type: null,
    cards: null
  },

  initialize: function () {

    var type = this.get('type'),
      set = new Stacked.Model.Type[type]();

    this.set({ set: set });

    this.replenish();
  },

  replenish: function () {

    var type = this.get('type'),
      set = new Stacked.Model.Type[type](),
      cards = new Stacked.Collection.Cards()

    for (var i = 0; i < this.get('decks'); i++) {
      _.each(set.get('suits'), function (suit) {
        _.each(set.get('cards'), function (card) {
          cards.add({ type: type, suit: suit, value: card });
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
