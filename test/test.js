'use strict';

var chai = require('chai');
var expect = chai.expect;
var klassy = require('../klassy');

describe('works', function() {
  it('should pass', function() {
    var Person = klassy({
      constructor: function(name) {
        this.name = name;
      },
      say: function() {
        return this.name;
      }
    });

    var bill = new Person('Bill');
    expect(bill.say()).to.equal('Bill');
  });
});