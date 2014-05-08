
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
