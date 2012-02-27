
var Stacked = {};

Stacked.Model = { Type: {}, Deck: null };
Stacked.View = {};
Stacked.Collection = {};

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

	Stacked.Collection.Cards = Backbone.Collection.extend({
		model: Stacked.Model.Card
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
				_.each(set.get('suites'), function (suite) {
					_.each(set.get('cards'), function (card) {
						cards.add({ type: type, suite: suite, number: card });
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

	Stacked.Collection.Hand = Backbone.Collection.extend({
		model: Stacked.Model.Card
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

	Stacked.Collection.Players = Backbone.Collection.extend({
		model: Stacked.Model.Player
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

		deal: function () {

			var i = 0,
				deck = this.get('deck');

			deck.replenish();
			deck.shuffle();

			while (i < this.get('cards')) {

				this.get('players').forEach(function (player) {
					player.get('hand').add(deck.pop());
				});

				i++;
			};
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

	Stacked.View.Hand = Backbone.View.extend({

		tagName: 'div',
		className: 'hand',

	 	render: function () {

	 		var el = this.el;

			this.model.each(function (card) {
				(new Stacked.View.Card({ el: el, model: card })).render();
			});
	 	}
	});

	Stacked.View.Player = Backbone.View.extend({

		render: function () {

			var html, hand = new Stacked.View.Hand({
				model: this.model.get('hand')
			});

			hand.render();

			html = $(ich.player(this.model.toJSON()));
			$('strong', html).after(hand.el);

			this.$el.append(html);
		}
	});

	Stacked.View.Game = Backbone.View.extend({

		render: function (elm) {

			var el = this.el;

			this.model.get('players').each(function (player) {
				(new Stacked.View.Player({ el: el, model: player })).render();
			});

			$(elm).html(this.el);
		}
	});

}) (jQuery);
