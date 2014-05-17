var Keys = require('../').Keys;
var U = require('underscore');

exports.imports = {
  'classes ok': function (t) {
    t.equal(typeof(Keys), 'function');
    t.equal(typeof(U), 'function');
    t.done();
  }
};


var keyFunction = function (v) {
  return v.key;
};

exports.emptyKeys = {
  'setUp': function (callback) {
    this.keys = new Keys(keyFunction);
    callback();
  },
  'default keys': function(t){
    var keys = new Keys();
    keys.add('a');
    t.ok(keys.keyPresent('a'));
    t.done();
  },
  'add': function (t) {
    var keys = this.keys;
    var o = {key: 'the key'};
    keys.add(o);
    var v = keys.value(o.key);
    t.equal(o, v);
    t.done();
  },

  'remove': function (t) {
    var keys = this.keys;
    var o = {key: 'the key'};
    keys.add(o);
    keys.remove(o);
    var v = keys.value(o.key);
    t.ok(v === undefined);
    t.done();
  }
};

exports.nonEmptyKeys = {
  'setUp': function (callback) {
    this.keys = new Keys(keyFunction);
    this.a = {v: 'A', key: '00-a'};
    this.b = {v: 'B', key: '00-b'};
    this.c = {v: 'C', key: '00-c'};

    this.keys.add(this.a);
    this.keys.add(this.b);
    this.keys.add(this.c);
    callback();
  },

  'key': function (t) {
    var keys = this.keys, a = this.a, b = this.b, c = this.c;
    t.equal(keys.key(a), a.key);
    t.equal(keys.key(b), b.key);
    t.equal(keys.key(c), c.key);
    t.done();
  },

  'keys': function (t) {
    var keys = this.keys, a = this.a, b = this.b, c = this.c;
    t.equal(keys.key(a), a.key);
    t.deepEqual(keys.key([b, c]), [b.key, c.key]);
    t.done();
  },

  'values': function (t) {
    var keys = this.keys, a = this.a, b = this.b, c = this.c;
    t.equal(keys.value(a.key), a);
    t.equal(keys.value(b.key), b);
    t.equal(keys.value(c.key), c);
    t.done();
  },

  'valuePresent': function(t){
    var keys = this.keys, a = this.a, b = this.b, c = this.c;
    t.ok(keys.valuePresent(a));
    t.ok(keys.valuePresent(b));
    t.ok(keys.valuePresent(c));
    t.ok(!keys.valuePresent('foo'));
    t.done();
  },

  'exportFunctions': function(t){
    var keys = this.keys, a = this.a, b = this.b, c = this.c;
    var k = keys.exportKeyFunction();
    var v = keys.exportValueFunction();

    t.equal(k(a), a.key);
    t.equal(v(a.key), a);
    t.done();
  }

};
