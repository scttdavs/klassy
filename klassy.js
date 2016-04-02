!function (name, context, definition) {
  if (typeof define == 'function') define(definition)
  else if (typeof module != 'undefined') module.exports = definition()
  else context[name] = definition()
}('klassy', this, function () {
  var klass = function(obj) {
    var newKlass = obj.constructor;
    if (newKlass) {
      // delete constructor since this will be the prototype
      delete obj.constructor;
    }  else {
      // no constructor, so use a default
      newKlass = function() {};
    }
    newKlass.prototype = obj;
    
    return newKlass;
  };

  return klass;
});