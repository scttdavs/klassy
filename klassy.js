!function (name, context, definition) {
  if (typeof define == 'function') define(definition)
  else if (typeof module != 'undefined') module.exports = definition()
  else context[name] = definition()
}('klassy', this, function () {
  var isStaticKey = function(key) {
    // we use $ because @ is not a valid identifier and would require quotes to use
    return key.indexOf('$') === 0;
  };

  var saveStatic = function(obj, newKlass) {
    var keys = Object.keys(obj); // save keys so we can delete them from obj without affecting looping/indexes
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (isStaticKey(key) && obj.hasOwnProperty(key)) {
        var newKey = key.slice(1); // remove $
        newKlass[newKey] = obj[key]; // save static method on klass
        delete obj[key]; // delete off prototype
      }
    }
  };

  var klass = function(obj) {
    var newKlass = obj.init;

    if (newKlass) {
      // delete init since this will be the prototype
      delete obj.init;
    }  else {
      // no init, so use a default
      newKlass = function() {};
    }
    // saves and removes static methods denoted with @
    saveStatic(obj, newKlass);
    newKlass.prototype = obj;

    return newKlass;
  };

  return klass;
});