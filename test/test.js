"use strict";

var chai = require("chai");
var expect = chai.expect;
var klassy = require("../klassy");

describe("Klassy", function() {

  // it("should create a default", function() {
  //   var Person = klassy();
  //   var bill = new Person();

  //   expect(Person).to.be.a("function");
  //   expect(bill).to.be.an("object");
  // });

  // it("should create a klass", function() {
  //   var Person = klassy({
  //     init: function(name) {
  //       this.name = name;
  //     },
  //     say: function() {
  //       return this.name;
  //     }
  //   });

  //   var bill = new Person("Bill");
  //   expect(bill.say()).to.equal("Bill");
  // });

  // it("should save a static method", function() {
  //   var Person = klassy({
  //     init: function(name) {
  //       this.name = name;
  //     },
  //     $say: function() {
  //       return "static";
  //     }
  //   });

  //   var bill = new Person("Bill");
  //   expect(bill.say).to.be.undefined;
  //   expect(Person.say()).to.equal("static")
  // });

  // it("should extend another klass", function() {
  //   var Animal = klassy({
  //     init: function(name) {
  //       this.name = name;
  //     },
  //     $say: function() {
  //       return "animal";
  //     }
  //   });

  //   var Dog = Animal.extend();
  //   var lassie = new Dog("Lassie");
  //   var cat = new Animal("Garfield");

  //   expect(cat.name).to.equal("Garfield");
  //   expect(Animal.say()).to.equal("animal");
  //   expect(lassie.say()).to.equal("animal");
  //   expect(lassie.name).to.equal("Lassie");
  // });

  it("should extend another klass with overrides/new methods", function() {
    var Animal = klassy({
      init: function(name) {
        this.name = name;
      },
      $say: function() {
        return "animal";
      },
      getName: function() {
        return this.name;
      }
    });

    var Dog = Animal.extend({
      init: function(name, breed) {
        this.name = name;
        this.breed = breed;
      },
      getBreed: function() {
        return this.breed;
      }
    });

    var lassie = new Dog("Lassie", "Collie");

    console.log("LASSIE:", lassie.prototype);
    expect(Dog.say()).to.equal("animal");
    expect(lassie.say).to.be.undefined;
    expect(lassie.getName()).to.equal("Lassie");
    expect(lassie.getBreed()).to.equal("Collie");
  });
});