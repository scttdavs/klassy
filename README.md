# Klassy

A bare bones vanilla js implementation of classes, influenced by coffeescript.

## Features

### Constructors

Simply pass a method in with the name `init` and it will behave as expected:

```js
var Person = klassy({
  init: function(name) {
    this.name = name;
  }
});

var bill = new Person('Bill');
bill.name // Bill
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
bill.talk() // error
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
george.say() // I'm an animal
```

## Testing

You will need to install `grunt-cli` if you haven't already.
Run `grunt test` to run tests and coverage. Coverage is saved in `coverage` folder.