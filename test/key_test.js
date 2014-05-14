//var dg = require('../');
//var test = require('tape');
//
//var keys;
//var key = function (v) {
//  return v.key;
//};
//
///*
// * directed_graph: new
// */
//module("keys: new", {
//  setup: function () {
//    keys = new Keys(key);
//  },
//  teardown: function () {
//    keys = null;
//  }
//});
//
//test("add", function () {
//  var o = {key: 'the key'};
//  keys.add(o);
//  var v = keys.value(o.key);
//  equal(o, v);
//});
//
//test("remove", function () {
//  var o = {key: 'the key'};
//  keys.add(o);
//  keys.remove(o);
//  var v = keys.value(o.key);
//  ok(v === undefined)
//});
//
//
//var a = {v: 'A', key: '00-a'};
//var b = {v: 'B', key: '00-b'};
//var c = {v: 'C', key: '00-c'};
//
///*
// * directed_graph: with edge and node
// */
//module("keys: populates", {
//  setup: function () {
//    keys = new Keys(key);
//    keys.add(a);
//    keys.add(b);
//    keys.add(c);
//  },
//
//  teardown: function () {
//    keys = null;
//  }
//});
//
//test("key", function () {
//  equal(keys.key(a), a.key);
//  equal(keys.key(b), b.key);
//  equal(keys.key(c), c.key);
//});
//
//test("keys", function () {
//  equal(keys.key(a), a.key);
//  deepEqual(keys.key([b, c]), [b.key, c.key]);
//});
//
//test("values", function () {
//  equal(keys.value(a.key), a);
//  equal(keys.value(b.key), b);
//  equal(keys.value(c.key), c);
//});
//
