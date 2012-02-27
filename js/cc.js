
var Stacked = {};
Stacked.Model = { Type: {}, Deck: null };
Stacked.View = {};

(function ($) {

	'use strict';

	/*
	 * Models
	 */

	Stacked.Model.Type.Base = Backbone.Model.extend({
		defaults: {
			cards: [],
			suites: []
		}
	});

	Stacked.Model.Type.Spanish = Stacked.Model.Type.Base.extend({
		defaults: {
			cards: [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
			suites: ['cups', 'clubs', 'coins', 'swords']
		}
	});

	Stacked.Model.Card = Backbone.Model.extend({
		defaults: {
			type: '',
			suite: '',
			number: 0
		}
	});

	Stacked.Model.Cards = Backbone.Collection.extend({
		model: Stacked.Model.Card
	});

	Stacked.Model.Deck = Backbone.Model.extend({

		defaults: {
			decks: 1,
			type: null
		},

		initialize: function () {

			var type = this.get('type'),
				set = new Stacked.Model.Type[type](),
				cards = new Stacked.Model.Cards()

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

	/*
	 * Views
	 */
	 Stacked.View.Card = Backbone.View.extend({
	 	render: function () {
	 		this.$el.append(ich.card(this.model.toJSON()));
	 	}
	 });
})(jQuery);
