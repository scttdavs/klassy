# Klassy

A bare bones vanilla js implementation of classes, influenced by coffeescript.

## Example

```js
var Person = klassy({
  constructor: function(name) {
    this.name = name;
  },
  say: function() {
    return this.name;
  }
});

var bill = new Person('Bill');
bill.say() // Bill
```

## Testing

You will need to install `grunt-cli` if you haven't already.
Run `grunt test` to run tests and coverage. Coverage is saved in `coverage` folder.