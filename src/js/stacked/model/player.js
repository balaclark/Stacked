
Stacked.Model.Player = Backbone.Model.extend({

  defaults: {
    name: '',
    hand: null,
  },

  initialize: function () {
    this.set('hand', new Stacked.Collection.Hand());
  }
});
