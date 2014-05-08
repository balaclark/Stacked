
Stacked.Model.Game = Backbone.Model.extend({

  defaults: {
    players: null,
    type: null,
    deck: null,
    cards: 7
  },

  initialize: function () {
    this.deal();
  },

  reset: function () {

    this.get('deck').replenish();

    this.get('players').forEach(function (player) {
      player.get('hand').reset();
    });
  },

  deal: function () {

    var i = 0,
      deck = this.get('deck');

    this.reset();

    deck.shuffle();

    while (i < this.get('cards')) {

      this.get('players').forEach(function (player) {
        player.get('hand').add(deck.pop());
      });

      i++;
    };
  }
});
