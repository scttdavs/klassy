!function (name, context, definition) {
  if (typeof define == 'function') define(definition);
  else if (typeof module != 'undefined') module.exports = definition();
  else context[name] = definition();
}('klassy', this, function () {
  'use strict';

  var CONSTRUCTOR = 'constructor';

  var isStaticKey = function(key) {
		return key.indexOf('$') === 0;
  };

  var getStaticKey = function(key) {
		if (isStaticKey(key)) {
		  return key.slice(1);
		}
		return key;
  };

  var isNotConstructor = function(key) {
		return key !== CONSTRUCTOR;
  };

  var extendStatic = function(base, obj, fromParent) {
		for (var key in obj) {
		  if (obj.hasOwnProperty(key) && isNotConstructor(key)) {
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
		  if (obj.hasOwnProperty(key) && isNotConstructor(key)) {
				// direct property
				base[key] = obj[key];
		  }
		}
  };

  var extendClass = function(parent) {
		return function(options) {
		  return klass(options, parent);
		};
  };

  var klass = function(options, parent) {
		options = options || {};
		var init = options.hasOwnProperty(CONSTRUCTOR) && options.constructor;
		var proto = Object.create((parent && parent.prototype) || {});

		if (!init && parent) {
		  init = parent;
		} else if (!init) {
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

  	// define super on protoype, searches up the chain until it finds it and then returns THAT implementation
		// no need to create expensive wrappers for every method.
    Object.defineProperty(init.prototype, "super", {
      get: function get() {
        return function() {
          var args = Array.prototype.slice.call(arguments);
          var name = args.slice(0, 1);
          args = args.slice(1);

    			var proto = Object.getPrototypeOf(this); // the instance that called super is 'this' here

	    		while ((proto = Object.getPrototypeOf(proto))) {
	    		  if (!proto[name]) {
	    				continue;
	    		  } else if (proto[name]) {
	    				return proto[name].apply(this, args);
	    		  }
	    		}

    			throw new Error("no `super` method was found!");
    		}.bind(this);
      }
    });

		return init;
  };

  return klass;
}); // jshint ignore:line
