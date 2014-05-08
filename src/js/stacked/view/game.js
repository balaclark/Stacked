
Stacked.View.Game = Backbone.View.extend({

  players: [],
  options: {},

  initialize: function (options) {

    var el = this.el,
      players = [];

    this.options = options;

    this.$el.addClass(this.model.get('deck').get('type').toLowerCase() + ' game');

    this.model.get('players').each(function (player) {
      players.push(new Stacked.View.Player({ el: el, model: player }));
    });

    this.players = players;
  },

  render: function (elm) {
    this.$el.empty();
    _.each(this.players, function (player) {
      player.render();
    });
    $(this.options.parentEl).html(this.el);
  },

  score: function () {
    // abstract method
  }

  // TODO: addPlayer method, allow game to be initialised without any players

});
