
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
