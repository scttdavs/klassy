

var chai = require("chai");
var expect = chai.expect;
var klassy = require("../klassy");

var Person = klassy({
  name: "Person",
  constructor: function(name) {
    if (name) {
      this.name = name;
    }
  },
  say: function() {
    return this.name;
  },
  $talk: function() {
    return "static";
  }
});

var Animal = klassy({
  constructor: function(name) {
    this.name = name;
  },
  $say: function() {
    return "animal";
  },
  getName: function() {
    return this.name;
  },
  getCapsName: function() {
    return this.name.toUpperCase();
  }
});

var Dog = Animal.extend({
  constructor: function(name, breed) {
    this.name = name;
    this.breed = breed;
  },
  getName: function() {
    return this.name;
  },
  getBreed: function() {
    return this.breed;
  }
});

var Bulldog = Dog.extend({
  constructor: function(name) {
    this.name = name;
    this.breed = "Bulldog";
  },
  getCapsName: function() {
    return this.super();
  }
});


describe("Basics", function() {
  it("should create a default", function() {
    var Person = klassy();
    var bill = new Person();

    expect(Person).to.be.a("function");
    expect(bill).to.be.an("object");
  });

  it("should create a klass", function() {
    var bill = new Person("Bill");
    var person = new Person();
    
    expect(bill.say()).to.equal("Bill");
    expect(person.say()).to.equal("Person");
  });
});

describe("Static Methods", function() {
  it("should save a static method", function() {
    var bill = new Person("Bill");
    expect(bill.talk).to.be.undefined;
    expect(Person.talk()).to.equal("static")
  });
});

describe("Subclassing", function() {
  it("should extend another klass", function() {
    var Dog = Animal.extend();
    var lassie = new Dog("Lassie");
    var cat = new Animal("Garfield");

    expect(cat.name).to.equal("Garfield");
    expect(Animal.say()).to.equal("animal");
    expect(Dog.say()).to.equal("animal");
    expect(lassie.say).to.be.undefined;
    expect(lassie.name).to.equal("Lassie");
  });

  it("should extend another klass with overrides/new methods", function() {
    var lassie = new Dog("Lassie", "Collie");

    expect(Dog.say()).to.equal("animal");
    expect(lassie.say).to.be.undefined;
    expect(lassie.getBreed()).to.equal("Collie");
  });

  it("should extend more than one klass", function() {
    var george = new Bulldog("George");

    expect(Bulldog.say()).to.equal("animal");
    expect(george.getName()).to.equal("George");
    expect(george.getBreed()).to.equal("Bulldog");
  });
});

describe("Super", function() {
  it("should work with super", function() {
    var george = new Bulldog("George");

    expect(Bulldog.say()).to.equal("animal");
    expect(george.getCapsName()).to.equal("GEORGE");
  });

  it("should not work in strict mode", function() {
    'use strict';
    var george = new Bulldog("George");

    expect(george.getCapsName).to.throw(Error);
  });
});