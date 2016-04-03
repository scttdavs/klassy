!function (name, context, definition) {
  if (typeof define == 'function') define(definition)
  else if (typeof module != 'undefined') module.exports = definition()
  else context[name] = definition()
}('klassy', this, function () {

  var isStaticKey = function(key) {
    return key.indexOf('$') === 0;
  };

  var getStaticKey = function(key) {
    if (isStaticKey(key)) {
      return key.slice(1);
    }
    return key;
  }

  var isFunction = function(obj) {
    return typeof obj === 'function';
  }

  var setName = function(fn, name) {
    if(isFunction(fn)) {
      fn._methodName = name;
    }
  }

  var extendStatic = function(base, obj, fromParent) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        // direct property
        if (isStaticKey(key) || fromParent) {
          var newKey = getStaticKey(key);
          base[newKey] = obj[key];
          if (isStaticKey(key)) {
            delete obj[key];
          }
        }
      }
    }
  };

  var extend = function(base, obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        // direct property
        base[key] = obj[key];
        setName(base[key], key);
      }
    }
  };

  var extendClass = function(parent) {
    return function(options) {
      return klass(options, parent);
    }
  }

  var klass = function(options, parent) {
    options = options || {};
    var init = options.init;
    var proto = Object.create((parent && parent.prototype) || {});

    if (init) {
      // delete init since options will be the prototype
      delete options.init;
    } else if (parent) {
      init = parent;
    }  else {
      // no init, so use a default
      init = function() {};
    }
    
    extendStatic(init, options);
    extend(proto, options);

    if (parent) {
      extendStatic(init, parent, true);
    }

    init.prototype = proto;
    init.extend = extendClass(init);

    Object.defineProperty(init.prototype, "supr", {
      get: function get() {
        console.log("CALLER", get.caller);
        var impl = get.caller,
          name = impl._methodName,
          foundImpl = this[name] === impl,
          proto = this;
     
        while (proto = Object.getPrototypeOf(proto)) {
          if (!proto[name]) {
            break;
          } else if (proto[name] === impl) {
            foundImpl = true;
          } else if (foundImpl) {
            return proto[name];
          }
        }
     
        if (!foundImpl) throw "`super` may not be called outside a method implementation";
      }
    });

    return init;
  };

  return klass;
});
