
var Stacked = { Type: {}, Deck: null };

(function () {

	'use strict';

	Stacked.Type.Base = Backbone.Model.extend({
		defaults: {
			cards: [],
			suites: []
		}
	});

	Stacked.Type.Spanish = Stacked.Type.Base.extend({
		defaults: {
			cards: [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
			suites: ['cups', 'clubs', 'coins', 'swords']
		}
	});

	Stacked.Card = Backbone.Model.extend({
		defaults: {
			type: '',
			suite: '',
			number: 0
		}
	});

	Stacked.Cards = Backbone.Collection.extend({
		model: Stacked.Card
	});

	Stacked.Deck = Backbone.Model.extend({

		defaults: {
			decks: 1,
			type: null
		},

		initialize: function () {

			var type = this.get('type'),
				set = new Stacked.Type[type](),
				cards = new Stacked.Cards()

			this.set({ set: set });

			for (var i = 0; i < this.get('decks'); i++) {
				_.each(set.get('suites'), function (suite) {
					_.each(set.get('cards'), function (card) {
						cards.add({ type: type, suite: suite, card: card });
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
		}
	});

})();
