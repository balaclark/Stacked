
Stacked.View.Card = Backbone.View.extend({

  events: {
    'change': 'render'
  },

  template: function (data) {
    return _.template($('#card').text(), data);
  },

  render: function () {

    var data = this.model.toJSON();

    data.cid = this.model.cid;

    this.$el.append(this.template(data));
  }

});
