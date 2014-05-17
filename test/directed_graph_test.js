var DirectedGraph = require('../').DirectedGraph;
var DirectedObjectGraph = require('../').DirectedObjectGraph;
var Keys = require('../').Keys;
var U = require('underscore');

exports.imports = {
  'classes ok': function (t) {
    t.equal(typeof(Keys), 'function');
    t.equal(typeof(DirectedGraph), 'function');
    t.equal(typeof(DirectedObjectGraph), 'function');
    t.equal(typeof(U), 'function');
    t.done();
  }
};

var t = (function () {
  var result = {};
  var Node = function (key, name) {
    this.key = key;
    this.name = name;
  };
  Node.prototype.toString = function () {
    return this.name
  };
  result.Node = Node;
  return result;
})();


var testsForEmptyGraph = {

  'isMember': function (t) {
    t.ok(!this.directedGraph.isMember(this.node));
    t.done();
  },


  'add': function (t) {
    this.directedGraph.add(this.node);
    t.ok(this.directedGraph.isMember(this.node));
    t.done();
  },

  'hasConnections': function (t) {
    t.ok(!this.directedGraph.hasConnections(this.node));
    t.done();
  },

  'isDetached': function (t) {
    t.ok(!this.directedGraph.isDetached(this.node));
    t.done();
  },

  'outFrom': function (t) {
    t.deepEqual([], this.directedGraph.outFrom(this.node));
    t.done();
  },

  'inTo': function (t) {
    t.deepEqual([], this.directedGraph.inTo(this.node));
    t.done();
  },

  'addEdge': function (t) {
    var a = this.a,
        b = this.b;
    this.directedGraph.addEdge(a, b);
    t.deepEqual([b], this.directedGraph.outFrom(a));
    t.deepEqual([a], this.directedGraph.inTo(b));
    t.done();
  },

  'isEdge': function (t) {
    var a = this.a, b = this.b;
    t.ok(!this.directedGraph.isEdge(a, b));
    t.done();
  },

  'removeEdge': function (t) {
    this.directedGraph.removeEdge(this.a, this.b);
    t.done();
  },

  'deleteConnected': function (t) {
    this.directedGraph.deleteConnected(this.node);
    t.done();
  },

  'deleteUnconnected': function (t) {
    this.directedGraph.deleteUnconnected(this.node);
    t.done();
  },

  'splice': function (t) {
    this.directedGraph.splice(this.node);
    t.done();
  },

  'toString': function (t) {
    t.equal('', this.directedGraph.toString());
    t.done();
  },

  'forEachIn': function (t) {
    this.directedGraph.forEachIn(this.node, function (t) {
      t.ok(false);
    });
    t.done();
  },

  'forEachOut': function (t) {
    this.directedGraph.forEachOut(this.node, function (t) {
      t.ok(false);
    });
    t.done();
  },

  'commonPredecessor': function (t) {
    t.ok(!this.directedGraph.commonPredecessor(this.node, this.node));
    t.done();
  }
};

exports.directedGraphEmpty = U.extend({
    setUp: function (callback) {
      this.directedGraph = new DirectedGraph();
      this.node = 'node';
      this.a = 'a';
      this.b = 'b';
      callback();
    }
  },
  testsForEmptyGraph);

exports.directedObjectGraphEmpty = U.extend({
    setUp: function (callback) {

      var keySet = new Keys(
        function (x) {
          return x.key;
        }
      );
      this.directedGraph = new DirectedObjectGraph(keySet);
      this.node = new t.Node('n', 'node');
      this.a = new t.Node('a', 'a');
      this.b = new t.Node('b', 'b');
      callback();
    }
  },
  testsForEmptyGraph);

var testsForNonEmptyGraph = {
  'isMember': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    t.ok(directedGraph.isMember(node));
    t.ok(directedGraph.isMember(a));
    t.ok(directedGraph.isMember(b));
    t.done();
  },

  'add': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    directedGraph.add(node);
    t.ok(directedGraph.isMember(node));
    t.done();
  },

  'hasConnections': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    t.ok(directedGraph.hasConnections(a));
    t.ok(directedGraph.hasConnections(b));
    t.ok(!directedGraph.hasConnections(node));
    t.done();
  },

  'isDetached': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    t.ok(directedGraph.isDetached(node));
    t.ok(!directedGraph.isDetached(a));
    t.ok(!directedGraph.isDetached(b));
    t.done();
  },

  'outFrom': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    t.deepEqual([], directedGraph.outFrom(node));
    t.done();
  },

  'inTo': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    t.deepEqual([], directedGraph.inTo(node));
    t.done();
  },

  'addEdge': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    t.ok(directedGraph.isEdge(a, b));
    directedGraph.addEdge(a, b);
    t.ok(directedGraph.isEdge(a, b));
    directedGraph.removeEdge(a, b);
    t.ok(!directedGraph.isEdge(a, b));

    directedGraph.addEdge(a, b);
    directedGraph.addEdge(a, node);
    t.ok(directedGraph.isEdge(a, b));
    t.ok(directedGraph.isEdge(a, node));
    t.deepEqual(directedGraph.outFrom(a), [b, node]);
    t.done();
  },

  'isEdge': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    t.ok(directedGraph.isEdge(a, b));
    t.ok(!directedGraph.isEdge(b, a));
    t.ok(!directedGraph.isEdge(a, node));
    t.done();
  },

  'removeEdge': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    directedGraph.removeEdge(a, b);
    t.ok(!directedGraph.isEdge(a, b));
    t.done();
  },

  'deleteConnected': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    directedGraph.deleteConnected(a);
    t.ok(!directedGraph.isEdge(a, b));
    t.ok(!directedGraph.isEdge(b, a));
    t.ok(!directedGraph.isMember(a));
    t.ok(directedGraph.isMember(b));
    t.done();
  },

  'deleteUnconnected': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    //try deleteUnconnected a connected
    directedGraph.deleteUnconnected(a);
    t.ok(directedGraph.isEdge(a, b));
    t.ok(directedGraph.isMember(a));
    t.ok(directedGraph.isMember(b));
    //try deleteUnconnected an unconnected
    directedGraph.deleteUnconnected(node);
    t.ok(!directedGraph.isMember(node));
    t.ok(directedGraph.isMember(a));
    t.ok(directedGraph.isMember(b));
    t.done();
  },

  'splice end': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    directedGraph.splice(b);
    t.ok(directedGraph.isMember(a));
    t.ok(!directedGraph.isMember(b));
    t.done();
  },

  'splice start': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    directedGraph.splice(a);
    t.ok(!directedGraph.isMember(a));
    t.ok(directedGraph.isMember(b));
    t.done();
  },

  'splice unconnected': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    directedGraph.splice(node);
    t.ok(!directedGraph.isMember(node));
    t.done();
  },

  'toString': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    t.equal("a,b,node\nb <- a", directedGraph.toString());
    t.done();
  },

  'forLeadTo unconnected': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    var visited = [];
    directedGraph.forEachIn(node, function (x, y) {
      visited.push(y);
    });
    t.deepEqual([node], visited);
    t.done();
  },

  'forLeadFrom unconnected': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    var visited = [];
    directedGraph.forEachOut(node, function (x, y) {
      visited.push(y);
    });
    t.deepEqual([node], visited);
    t.done();
  },

  'forLeadTo end': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    var visited = [];
    directedGraph.forEachIn(b, function (x, y) {
      visited.push(y);
    });
    t.deepEqual([b, a], visited);
    t.done();
  },

  'forLeadFrom start': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    var visited = [];
    directedGraph.forEachOut(a, function (x, y) {
      visited.push(y);
    });
    t.deepEqual([a, b], visited);
    t.done();
  },

  'commonPredecessor unconnected': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    t.ok(directedGraph.commonPredecessor(node, node));
    t.done();
  },

  'commonDescendant unconnected': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    t.ok(directedGraph.commonDescendant(node, node));
    t.done();
  },

  'commonPredecessor': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    t.equal(a, directedGraph.commonPredecessor(a, b));
    t.equal(a, directedGraph.commonPredecessor(b, a));
    t.equal(a, directedGraph.commonPredecessor(a, a));
    t.equal(b, directedGraph.commonPredecessor(b, b));
    t.equal(node, directedGraph.commonPredecessor(node, node));

    t.ok(!directedGraph.commonPredecessor(node, a));
    t.ok(!directedGraph.commonPredecessor(a, node));
    t.ok(!directedGraph.commonPredecessor(node, b));
    t.ok(!directedGraph.commonPredecessor(b, node));
    t.done();
  },

  'withoutOutgoing': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    t.deepEqual(directedGraph.all(), [node, a, b]);
    t.deepEqual(directedGraph.inTo(a), []);
    t.deepEqual(directedGraph.inTo(b), [a]);
    t.deepEqual(directedGraph.withoutIncoming(), [node, a]);
    t.done();
  },

  'withoutIncoming': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    t.deepEqual(directedGraph.withoutOutgoing(), [node, b]);
    t.done();
  },

  'severIns.1': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    directedGraph.severIns(b);
    t.ok(!directedGraph.isMember(a));
    t.ok(!directedGraph.isMember(b));
    t.ok(directedGraph.isMember(node));

    directedGraph.severIns(node);
    t.ok(!directedGraph.isMember(node));
    t.done();
  },

  'severIns.2': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    directedGraph.severIns(a);
    t.ok(!directedGraph.isMember(a));
    t.ok(directedGraph.isMember(b));
    t.ok(directedGraph.isMember(node));
    t.done();
  },

  'severOuts.1': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    directedGraph.severOuts(b);
    t.ok(directedGraph.isMember(a));
    t.ok(!directedGraph.isMember(b));
    t.ok(directedGraph.isMember(node));

    directedGraph.severOuts(node);
    t.ok(!directedGraph.isMember(node));
    t.done();
  },

  'severOuts.2': function (t) {
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    directedGraph.severOuts(a);
    t.ok(!directedGraph.isMember(a));
    t.ok(!directedGraph.isMember(b));
    t.ok(directedGraph.isMember(node));
    t.done();
  },

  'toJSON': function(t){
    var directedGraph = this.directedGraph, node = this.node, a = this.a, b=this.b;
    this.emptyGraph.fromJSON(directedGraph.toJSON());
    t.deepEqual(this.emptyGraph, directedGraph);
    t.done();
  }

};

exports.directedGraphNonEmpty = U.extend({
    setUp: function (callback) {
      this.emptyGraph = new DirectedGraph();
      this.directedGraph = new DirectedGraph();
      this.node = 'node';
      this.a = 'a';
      this.b = 'b';
      this.directedGraph.add(this.node);
      this.directedGraph.addEdge(this.a, this.b);
      callback();
    }
  },
  testsForNonEmptyGraph);

exports.directedObjectGraphNonEmpty = U.extend({
    setUp: function (callback) {

      var keySet = new Keys(
        function (x) {
          return x.key;
        }
      );
      this.emptyGraph = new DirectedObjectGraph(keySet);
      this.directedGraph = new DirectedObjectGraph(keySet);
      this.node = new t.Node('n', 'node');
      this.a = new t.Node('a', 'a');
      this.b = new t.Node('b', 'b');
      this.directedGraph.add(this.node);
      this.directedGraph.addEdge(this.a, this.b);
      callback();
    }
  },
  testsForNonEmptyGraph);
