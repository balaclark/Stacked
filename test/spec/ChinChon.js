'use strict';

describe('CC', function () {

  var type = Stacked.Model.Type.Spanish;

  describe('Score a hand', function () {

    it('chinchon', function () {

      var hand1 = new Stacked.Collection.Hand([
        { type: type, suit: 'clubs', value: 1 },
        { type: type, suit: 'clubs', value: 2 },
        { type: type, suit: 'clubs', value: 3 },
        { type: type, suit: 'clubs', value: 4 },
        { type: type, suit: 'clubs', value: 5 },
        { type: type, suit: 'clubs', value: 6 },
        { type: type, suit: 'clubs', value: 7 }
      ]);

      var hand2 = new Stacked.Collection.Hand([
        { type: type, suit: 'coins', value: 4 },
        { type: type, suit: 'coins', value: 5 },
        { type: type, suit: 'coins', value: 6 },
        { type: type, suit: 'coins', value: 7 },
        { type: type, suit: 'coins', value: 10 },
        { type: type, suit: 'coins', value: 11 },
        { type: type, suit: 'coins', value: 12 }
      ]);

      ChinChon.prototype.scoreHand(hand1).should.eql(ChinChon.prototype.CHINCHON);
      ChinChon.prototype.scoreHand(hand2).should.eql(ChinChon.prototype.CHINCHON);
    });

    describe('menos diez', function () {

      it('single values', function () {

        var hand = new Stacked.Collection.Hand([
          { type: type, suit: 'clubs', value: 1 },
          { type: type, suit: 'coins', value: 1 },
          { type: type, suit: 'swords', value: 1 },
          { type: type, suit: 'cups', value: 1 },
          { type: type, suit: 'cups', value: 6 },
          { type: type, suit: 'swords', value: 6 },
          { type: type, suit: 'coins', value: 6 }
        ]);

        ChinChon.prototype.scoreHand(hand).should.eql(-10);
      });

      it('escaleras', function () {

        var hand = new Stacked.Collection.Hand([
          { type: type, suit: 'clubs', value: 1 },
          { type: type, suit: 'coins', value: 7 },
          { type: type, suit: 'coins', value: 11 },
          { type: type, suit: 'clubs', value: 2 },
          { type: type, suit: 'clubs', value: 3 },
          { type: type, suit: 'clubs', value: 4 },
          { type: type, suit: 'coins', value: 10 }
        ]);

        ChinChon.prototype.scoreHand(hand).should.eql(-10);
      });

      it('mixed', function () {

        var hand = new Stacked.Collection.Hand([
          { type: type, suit: 'clubs', value: 1 },
          { type: type, suit: 'coins', value: 1 },
          { type: type, suit: 'swords', value: 1 },
          { type: type, suit: 'cups', value: 1 },
          { type: type, suit: 'cups', value: 7 },
          { type: type, suit: 'cups', value: 10 },
          { type: type, suit: 'cups', value: 11 }
        ]);

        ChinChon.prototype.scoreHand(hand).should.eql(-10);
      });
    });

    it('counts points', function () {

      var hand1 = new Stacked.Collection.Hand([
        { type: type, suit: 'clubs', value: 1 },
        { type: type, suit: 'clubs', value: 2 },
        { type: type, suit: 'clubs', value: 3 },
        { type: type, suit: 'clubs', value: 4 },
        { type: type, suit: 'coins', value: 1 },
        { type: type, suit: 'coins', value: 3 },
        { type: type, suit: 'coins', value: 11 }
      ]);

      var hand2 = new Stacked.Collection.Hand([
        { type: type, suit: 'clubs', value: 1 },
        { type: type, suit: 'coins', value: 1 },
        { type: type, suit: 'swords', value: 1 },
        { type: type, suit: 'cups', value: 1 },
        { type: type, suit: 'cups', value: 6 },
        { type: type, suit: 'swords', value: 6 },
        { type: type, suit: 'coins', value: 7 }
      ]);

      var hand3 = new Stacked.Collection.Hand([
        { type: type, suit: 'clubs', value: 1 },
        { type: type, suit: 'coins', value: 2 },
        { type: type, suit: 'coins', value: 3 },
        { type: type, suit: 'cups', value: 4 },
        { type: type, suit: 'swords', value: 5 },
        { type: type, suit: 'swords', value: 6 },
        { type: type, suit: 'coins', value: 7 }
      ]);

      var hand4 = new Stacked.Collection.Hand([
        { type: type, suit: 'coins', value: 1 },
        { type: type, suit: 'coins', value: 2 },
        { type: type, suit: 'coins', value: 3 },
        { type: type, suit: 'cups', value: 4 },
        { type: type, suit: 'swords', value: 5 },
        { type: type, suit: 'swords', value: 6 },
        { type: type, suit: 'swords', value: 7 }
      ]);

      var hand5 = new Stacked.Collection.Hand([
        { type: type, suit: 'coins', value: 1 },
        { type: type, suit: 'coins', value: 2 },
        { type: type, suit: 'coins', value: 3 },
        { type: type, suit: 'cups', value: 11 },
        { type: type, suit: 'swords', value: 7 },
        { type: type, suit: 'swords', value: 10 },
        { type: type, suit: 'swords', value: 11 }
      ]);

      var hand6 = new Stacked.Collection.Hand([
        { type: type, suit: 'coins', value: 2 },
        { type: type, suit: 'coins', value: 6 },
        { type: type, suit: 'coins', value: 7 },
        { type: type, suit: 'coins', value: 10 },
        { type: type, suit: 'swords', value: 11 },
        { type: type, suit: 'cups', value: 1 },
        { type: type, suit: 'clubs', value: 6 }
      ]);

      var hand7 = new Stacked.Collection.Hand([
        { type: type, suit: 'coins', value: 1 },
        { type: type, suit: 'coins', value: 2 },
        { type: type, suit: 'coins', value: 4 },
        { type: type, suit: 'coins', value: 5 },
        { type: type, suit: 'coins', value: 7 },
        { type: type, suit: 'coins', value: 10 },
        { type: type, suit: 'coins', value: 11 }
      ]);

      ChinChon.prototype.scoreHand(hand1).should.eql(15);
      ChinChon.prototype.scoreHand(hand2).should.eql(19);
      ChinChon.prototype.scoreHand(hand3).should.eql(28);
      ChinChon.prototype.scoreHand(hand4).should.eql(4);
      ChinChon.prototype.scoreHand(hand5).should.eql(11);
      ChinChon.prototype.scoreHand(hand6).should.eql(20);
      ChinChon.prototype.scoreHand(hand7).should.eql(12);
    });

    it('allows numbers to be passed as strings', function () {

      var hand = new Stacked.Collection.Hand([
        { type: type, suit: 'clubs', value: 1 },
        { type: type, suit: 'clubs', value: '2' },
        { type: type, suit: 'clubs', value: 3 },
        { type: type, suit: 'clubs', value: '4' },
        { type: type, suit: 'coins', value: '1' },
        { type: type, suit: 'coins', value: '3' },
        { type: type, suit: 'coins', value: 11 }
      ]);

      ChinChon.prototype.scoreHand(hand).should.eql(15);
    });
  });

});
