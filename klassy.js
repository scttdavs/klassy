!function (name, context, definition) {
  if (typeof define == 'function') define(definition)
  else if (typeof module != 'undefined') module.exports = definition()
  else context[name] = definition()
}('klassy', this, function () {

  var isStaticKey = function(key) {
    return key.indexOf('$') === 0;
  };

  var extend = function(klass, parent, fromKlass) {
    var proto = {};
    
    for (var key in parent) {
      if (parent.hasOwnProperty(key)) {
        // direct property
        if (isStaticKey(key)) {
          var newKey = key.slice(1); // remove $
          klass[newKey] = parent[key]; // save static method on klass
        } else if (fromKlass) {
          klass[key] = parent[key]; // save static method on klass
        } else {
          proto[key] = parent[key]; // instance method, save on prototype
        }
      }
    }

    if (fromKlass) {
      function ctor() { 
        this.constructor = klass; 
      } 

      for (var key in klass.prototype) {
        if (klass.prototype.hasOwnProperty(key)) {
          parent.prototype[key] = klass.prototype[key];
        }
      }

      ctor.prototype = parent.prototype; 
      klass.prototype = new ctor(); 
      // klass.__super__ = parent.prototype; 

    } else {
      klass.prototype = proto;
    }
    
    return klass;
  };

  var curryExtend = function(init) {
    return function(child) {
      child = child || {};
      if (!child.init) {
        child.init = init;
      }

      return extend(klass(child), init, true);
    };
  }

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
    init = extend(init, options);
    init.extend = curryExtend(init);

    return init;
  };

  return klass;
});