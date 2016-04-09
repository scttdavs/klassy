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

  var isPrivateKey = function(key) {
		return key.indexOf('_') === 0;
  };

  var isFunction = function(obj) {
		return typeof obj === 'function';
  };

  var getProcessedKey = function(key) {
		if (isStaticKey(key) || isPrivateKey(key)) {
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
			  var newKey = getProcessedKey(key);
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

  var addVariable = function(obj, key, isPrivateKey) {
  	var prefix = isPrivateKey ? "var " : "this.";
  	if (isFunction(obj[key])) {
			return prefix + getProcessedKey(key) + " = " + obj[key].toString() + ";";
		} else {
			try {
				return prefix + getProcessedKey(key) + " = " + JSON.stringify(obj[key]) + ";";
			} catch(error) {
				throw new Error("There was an error parsing this, functions in object literal?");
			}
		}
  };

  var makeNewConstructor = function(obj) {
  	var newC = "";
  	for (var key in obj) {
		  if (obj.hasOwnProperty(key)) {
	  		if (isNotConstructor(key) && !isStaticKey(key)) {
	  			if (isPrivateKey(key)) {
	  				newC += addVariable(obj, key, true);
	  				delete obj[key];
	  			} else {
	  				newC += addVariable(obj, key);
	  			}
	  		}		
		  }
		}
		return {
			newC: new Function(newC), // jshint ignore:line
			obj: obj
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

		//console.log("OPTIONS", options);
		// make new constructor here
		var details = makeNewConstructor(options);
		console.log("DETAILS: ", details);

		init = details.newC;
		options = details.obj;

		//console.log("OPTIONS", options);

		extendStatic(init, options);
		extend(proto, options);

		console.log("OPTIONS", options);

		if (parent) {
		  extendStatic(init, parent, true);
		}

		Object.setPrototypeOf(init, proto);
		//init.prototype = proto;
		//console.log("IS EXTENDABLE", Object.isExtensible(init));
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
