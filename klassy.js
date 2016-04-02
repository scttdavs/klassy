!function (name, context, definition) {
  if (typeof define == 'function') define(definition)
  else if (typeof module != 'undefined') module.exports = definition()
  else context[name] = definition()
}('klassy', this, function () {
  var isStaticKey = function(key) {
    // we use $ because @ is not a valid identifier and would require quotes to use
    return key.indexOf('$') === 0;
  };

  var extend = function(init, parent) {
    var proto = {};
    
    for (var key in parent) {
      if (parent.hasOwnProperty(key)) {
        // direct property
        if (isStaticKey(key)) {
          var newKey = key.slice(1); // remove $
          init[newKey] = parent[key]; // save static method on klass
        } else {
          // instance method, save on prototype
          proto[key] = parent[key];
        }
      } else {
        // found on prototype
        proto[key] = parent[key]
      }
    }

    init.prototype = proto;

    return init;
  };

  var klass = function(options) {
    options = options || {}
    var init = options.init;

    if (init) {
      // delete init since options will be the prototype
      delete options.init;
    }  else {
      // no init, so use a default
      init = function() {};
    }
    // saves and removes static methods denoted with $
    init = extend(init, options);

    return init;
  };

  return klass;
});