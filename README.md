z5h.directed-graph
=========

[![Build Status](https://travis-ci.org/z5h/z5h.directed-graph.svg?branch=master)](https://travis-ci.org/z5h/z5h.directed-graph)

JavaScript Directed Graph Library

```
    //with strings as nodes
    var graph = new DirectedGraph();     
    graph.add('disconnected');
    graph.addEdge('a', 'b');
    graph.isMember('a');
    //...
    
    //with arbitrary objects as nodes
    var Node = function (key, name) {
        this.key = key;
        this.name = name;
    };
    var keys = new Keys(
        function (x) {
            return x.key;
        }
    );
    var graph = new DirectedObjectGraph(keys);
    graph.add(new Node('some_key', 'some_value'));
    //...
```
