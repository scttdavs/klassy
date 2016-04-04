# Klassy

A bare bones vanilla js implementation of classes, influenced by coffeescript.

## Why?

ES6 has classes, coffeescript and typescript have classes..

Well, for many reasons this may still be useful 

- Maybe your team would like to move to ES6 soon, but cannot due to browser concerns
- or you cannot/do not want to transpile
- or your team uses ES6 but only certain features
- or you're concerned about ES6 performance
- or you just really like ES5... 

Either way, this provides a pretty consistent way to define classes in JS so that when the time comes to switch to ES6, or coffeescript, or typescript, it will be fairly easy to change and will not require refactoring code (much).

## Features

### Constructors

Simply pass a method in with the name `init` and it will behave as a constructor. The key `constructor` was avoided to prevent collisions with internal object constructors.

```js
var Person = klassy({
  name: "Person",
  init: function(name) {
    if (name) {
      this.name = name;
    }    
  }
});

var bill = new Person('Bill');
var person = new Person();
bill.name // Bill
person.name // Person
```

### Static Methods

Any method name beginning with `$` will be saved as a static method. This varies from coffeescipt's `@` because the `@` is not a valid identifier and would need to be wrapped in quotes to be used. Only `$` and `_` are valid nonalphanumeric identifiers and `_` is conventional for private methods/variables.

```js
var Person = klassy({
  init: function(name) {
    this.name = name;
  },
  $talk: function() {
    return "Hi!";
  }
}
});

Person.talk() // Hi!

var bill = new Person('Bill');
bill.talk() // womp womp
```

### Subclassing

Subclassing multilple klasses is supported.

```js
var Animal = klassy({
  $say: function() {
    return "I'm an animal";
  }
});

var Dog = Animal.extend({
  init: function(breed) {
    this.breed = breed;
  },
  getBreed: function() {
    return this.breed;
  }
});

var Bulldog = Dog.extend({
  init: function() {
    this.breed = "Bulldog";
  }
});

var george = new Bulldog("George");
george.getBreed() // Bulldog
Bulldog.say() // I'm an animal
```

### Super

Call the super class' method with `super`.

```js
var Animal = klassy({
  init: function(name) {
    this.name = name;
  },
  getName: function() {
    return this.name;
  }
});

var Dog = Animal.extend();

var Bulldog = Dog.extend({
  getName: function() {
    // do some stuff
    return this.super();
  }
});

var george = new Bulldog("George");
george.getName(); // George
```

## Testing

You will need to install `grunt-cli` if you haven't already.
Run `grunt test` to run tests and coverage. Coverage is saved in `coverage` folder.