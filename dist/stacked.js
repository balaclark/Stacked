var Stacked;

(function () {

'use strict'

Stacked = {
	Collection: {},
	Model: { Type: {}, Deck: null },
	View: {}
};


Stacked.Model.Card = Backbone.Model.extend({
  defaults: {
    type: '',
    suit: '',
    value: 0
  }
});


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


Stacked.Model.Player = Backbone.Model.extend({

  defaults: {
    name: '',
    hand: null,
  },

  initialize: function () {
    this.set('hand', new Stacked.Collection.Hand());
  }
});


Stacked.Model.Type.Base = Backbone.Model.extend({
  defaults: {
    cards: [],
    suits: []
  }
});


Stacked.Model.Type.Spanish = Stacked.Model.Type.Base.extend({
  defaults: {
    cards: [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
    suits: ['cups', 'clubs', 'coins', 'swords']
  }
})


Stacked.Collection.Cards = Backbone.Collection.extend({
  model: Stacked.Model.Card
});


Stacked.Collection.Hand = Backbone.Collection.extend({

  model: Stacked.Model.Card,

  updateValues: function (values) {
    $.each(values, _.bind(function (key, attributes) {
      this.at(key).set(attributes);
    }, this));
  },

  grouped: function () {

    var group;
    var grouped = [];
    var group_index = 0;
    var hand = this.toJSON();

    // TODO: move all these functions to a separate module
    var mapSequence = function (sequence, map) {
      return sequence.map(function (num) {
        return map[num];
      });
    }

    var groupSequence = function (sequence) {

      var grouped = [[]]
        , group_index = 0
        , next_num_follows_sequence
        , is_last_of_sequence;

      sequence.forEach(function (num, i) {

        next_num_follows_sequence = !(i === sequence.length - 1);
        is_last_of_sequence = !(num === sequence[i+1] - 1);

        grouped[group_index].push(num);

        if (next_num_follows_sequence && is_last_of_sequence) {
          group_index++;
          grouped[group_index] = [];
        }
      });

      return grouped;
    };

    /**
     * Returns the largest valid group of cards from a given set of cards.
     * @param  {array} data
     * @return {array}
     */
    var getLargestGroup = function (data) {

      // FIXME: the sequence should be set per hand type
      var SEQUENCE = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 10: 8, 11: 9, 12: 10 };
      var groups = [];
      var suits = _.groupBy(data, 'suit');

      _.each(suits, function (group) {

        var values = _.sortBy(_.pluck(group, 'value'), function (v) { return v; });
        var mappedValues = mapSequence(values, SEQUENCE);
        var ladders = groupSequence(mappedValues);

        ladders = ladders.map(function (ladder) {
          return ladder.map(function (num) {
            return (_.invert(SEQUENCE))[num];
          });
        });

        ladders.forEach(function (ladder) {

          var cards = _.filter(group, function (card) {
            return ladder.indexOf(card.value+'') > -1;
          });

          groups.push(cards);

          values = _.filter(values, function (value) {
            return ladder.indexOf(value) === -1;
          });
        });
      });

      _.each(_.groupBy(data, 'value'), function (group) {
        groups.push(group);
      });

      groups = _.sortBy(groups, 'length').reverse();

      return _.max(groups, function (group) {
        return group.length;
      });
    };

    /**
     * Removes a group of cards from a given set.
     * @param  {array} data
     * @param  {array} group
     * @return {array}
     */
    var filterGroup = function (data, group) {
      return _.filter(data, function (card) {
        return !_.findWhere(group, card);
      });
    };

    // re-arranges the hand by its largest set of valid groups
    while (hand.length) {
      group = getLargestGroup(hand);
      grouped.push(group);
      hand = filterGroup(hand, group)
    }

    return grouped;
  }
});


Stacked.Collection.Players = Backbone.Collection.extend({
  model: Stacked.Model.Player
});


Stacked.View.Card = Backbone.View.extend({

  events: {
    'change': 'render'
  },

  render: function () {

    var data = this.model.toJSON();

    data.cid = this.model.cid;

    this.$el.append(ich.card(data));
  }

});


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


Stacked.View.Hand = Backbone.View.extend({

  tagName: 'ul',

  className: 'hand',

  events: {
    'sortstop ': 'reorder'
  },

  cards: [],

  initialize: function () {

    var el = this.el,
      cards = [];

    this.model.each(function (card) {
      cards.push(new Stacked.View.Card({ el: el, model: card }));
    });

    this.cards = cards;
  },

  render: function (ddd) {

    var el = this.el;

    this.$el.empty();

    _.each(this.cards, function (card) {
      card.render();
    });

    this.$el.sortable({
      axis: 'x',
      cursor: 'move',
      placeholder: 'card-drop-target',
      tolerance: 'pointer',
      containment: 'parent'
    });
  },

  reorder: function (event, ui) {

    var values = [];

    this.$('.card').each(function (i, elm) {
      values.push($(elm).data());
    });

    this.model.updateValues(values);

    this.render();
  }
});


Stacked.View.Player = Backbone.View.extend({

  render: function () {

    var html, hand = new Stacked.View.Hand({
      model: this.model.get('hand')
    });

    hand.render();

    html = $(ich.player(this.model.toJSON()));
    $('.name', html).after(hand.el);

    this.$el.append(html);
  }
});

})();
