"use strict";

var chai = require("chai");
var expect = chai.expect;
var klassy = require("../klassy");

describe("Klassy", function() {

  it("should create a default", function() {
    var Person = klassy();
    var bill = new Person();

    expect(Person).to.be.a("function");
    expect(bill).to.be.an("object");
  });

  it("should create a klass", function() {
    var Person = klassy({
      init: function(name) {
        this.name = name;
      },
      say: function() {
        return this.name;
      }
    });

    var bill = new Person("Bill");
    expect(bill.say()).to.equal("Bill");
  });

  it("should save a static method", function() {
    var Person = klassy({
      init: function(name) {
        this.name = name;
      },
      $say: function() {
        return "static";
      }
    });

    var bill = new Person("Bill");
    expect(bill.say).to.be.undefined;
    expect(Person.say()).to.equal("static")
  });
});