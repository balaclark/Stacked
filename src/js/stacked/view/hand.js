
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
