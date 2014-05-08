
Stacked.View.Player = Backbone.View.extend({

  template: function (data) {
    return _.template($('#player').text(), data);
  },

  render: function () {

    var html, hand = new Stacked.View.Hand({
      model: this.model.get('hand')
    });

    hand.render();

    html = $(this.template(this.model.toJSON()));
    $('.name', html).after(hand.el);

    this.$el.append(html);
  }
});
