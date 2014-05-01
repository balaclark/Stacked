'use strict';

var ChinChon = Stacked.View.Game.extend({

  CHINCHON: -100,
  MENOS_DIEZ: -10,

  initialize: function (options) {

    this.model = new Stacked.Model.Game({
      deck: new Stacked.Model.Deck({
        type: 'Spanish',
        decks: 2
      }),
      players: new Stacked.Collection.Players(options.players)
    });

    Stacked.View.Game.prototype.initialize.call(this);
  },

  // score: function (cb) {
  //   this.model.get('players').each(function (player) {
  //     console.log(player.get('name'), player.get('hand').toJSON());
  //     cb();
  //   });
  // },

  scoreHand: function (hand) {

    var score, losers;
    var grouped = hand.grouped();

    switch (grouped.length) {
      case 1: return this.CHINCHON;
      case 2: return this.MENOS_DIEZ;

      // remove any valid groups from the hand and count the values of the ones
      // that are left
      default:
        return _.chain(grouped)
          .filter(function (group) {
            return group.length < 3;
          })
          .flatten()
          .pluck('value')
          .reduce(function (memo, val) {
            return memo + val;
          }, 0)
          .value();
    }

    return score;
  }
});
