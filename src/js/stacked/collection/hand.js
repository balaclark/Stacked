
Stacked.Collection.Hand = Backbone.Collection.extend({

  model: Stacked.Model.Card,

  updateValues: function (values) {
    $.each(values, _.bind(function (key, attributes) {
      this.at(key).set(attributes);
    }, this));
  },

  grouped: function () {

    var group;
    var grouped = [];
    var group_index = 0;
    var hand = this.toJSON();

    // TODO: move all these functions to a separate module
    var mapSequence = function (sequence, map) {
      return sequence.map(function (num) {
        return map[num];
      });
    }

    var groupSequence = function (sequence) {

      var grouped = [[]]
        , group_index = 0
        , next_num_follows_sequence
        , is_last_of_sequence;

      sequence.forEach(function (num, i) {

        next_num_follows_sequence = !(i === sequence.length - 1);
        is_last_of_sequence = !(num === sequence[i+1] - 1);

        grouped[group_index].push(num);

        if (next_num_follows_sequence && is_last_of_sequence) {
          group_index++;
          grouped[group_index] = [];
        }
      });

      return grouped;
    };

    /**
     * Returns the largest valid group of cards from a given set of cards.
     * @param  {array} data
     * @return {array}
     */
    var getLargestGroup = function (data) {

      // FIXME: the sequence should be set per hand type
      var SEQUENCE = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 10: 8, 11: 9, 12: 10 };
      var groups = [];
      var suits = _.groupBy(data, 'suit');

      _.each(suits, function (group) {

        var values = _.sortBy(_.pluck(group, 'value'), function (v) { return v; });
        var mappedValues = mapSequence(values, SEQUENCE);
        var ladders = groupSequence(mappedValues);

        ladders = ladders.map(function (ladder) {
          return ladder.map(function (num) {
            return (_.invert(SEQUENCE))[num];
          });
        });

        ladders.forEach(function (ladder) {

          var cards = _.filter(group, function (card) {
            return ladder.indexOf(card.value+'') > -1;
          });

          groups.push(cards);

          values = _.filter(values, function (value) {
            return ladder.indexOf(value) === -1;
          });
        });
      });

      _.each(_.groupBy(data, 'value'), function (group) {
        groups.push(group);
      });

      groups = _.sortBy(groups, 'length').reverse();

      return _.max(groups, function (group) {
        return group.length;
      });
    };

    /**
     * Removes a group of cards from a given set.
     * @param  {array} data
     * @param  {array} group
     * @return {array}
     */
    var filterGroup = function (data, group) {
      return _.filter(data, function (card) {
        return !_.findWhere(group, card);
      });
    };

    // re-arranges the hand by its largest set of valid groups
    while (hand.length) {
      group = getLargestGroup(hand);
      grouped.push(group);
      hand = filterGroup(hand, group)
    }

    return grouped;
  }
});
