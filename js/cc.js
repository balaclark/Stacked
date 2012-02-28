
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
			suits: []
		}
	});

	Stacked.Model.Type.Spanish = Stacked.Model.Type.Base.extend({
		defaults: {
			cards: [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
			suits: ['cups', 'clubs', 'coins', 'swords']
		}
	});

	Stacked.Model.Card = Backbone.Model.extend({
		defaults: {
			type: '',
			suit: '',
			value: 0
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

	/*
	 * Views
	 */

	Stacked.View.Card = Backbone.View.extend({

	 	render: function () {

	 		var data = this.model.toJSON();

	 		data.id = data.id || this.model.cid;

	 		this.$el.append(ich.card(data));
	 	}

	});

	Stacked.View.Hand = Backbone.View.extend({

		tagName: 'ul',
		className: 'hand',

	 	render: function () {

	 		var el = this.el;

			this.model.each(function (card) {
				(new Stacked.View.Card({ el: el, model: card })).render();
			});

			this.$el.sortable({
				axis: 'x',
				cursor: 'move',
				placeholder: 'card-drop-target',
				tolerance: 'pointer',
				containment: 'parent'
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
			$('.name', html).after(hand.el);

			this.$el.append(html);
		}
	});

	Stacked.View.Game = Backbone.View.extend({

		players: [],

		initialize: function () {

			var el = this.el,
				players = [];

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
		}

	});

}) (jQuery);
