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

## Testing

You will need to install `grunt-cli` if you haven't already.
Run `grunt test` to run tests and coverage. Coverage is saved in `coverage` folder.