_ = require('underscore')

class DirectedGraph
  PRESENT = new Object()

  constructor: ->
    #forward goes OUT from a node to listed nodes
    @_outs = {}
    #backwards goes IN to a node from listed nodes
    @_ins = {}
    @_all = {}

  toJSON: ->
    JSON.stringify({
      'all' : @_all,
      'ins' : @_ins,
      'outs' : @_outs,
    })

  fromJSON: (json) ->
    data = JSON.parse(json)
    @_all = data['all']
    @_outs  = data['outs']
    @_ins = data['ins']
    
  toString: (toS = (x) -> x) ->
    strings = [_.map(@all(), toS).sort().join(',')]
    for key, values of @_ins
      strings.push "#{toS(key)} <- #{_.map(values, toS).join(',')}"
    strings.join "\n"

  all: ->
    Object.keys(@_all)

  size : ->
    _.size(@_all)

  add: (node) ->
    @_all[node] = PRESENT

  isMember: (node) ->
    @_all[node] is PRESENT

  deleteUnconnected: (node) ->
    delete @_all[node] if @isDetached(node)

  deleteConnected: (node) ->
    for end in @outFrom(node)
      @removeEdge(node, end)
    for start in @inTo(node)
      @removeEdge(start, node)
    @deleteUnconnected(node)

  splice: (node) ->
    ends = @outFrom(node)
    starts = @inTo(node)
    @deleteConnected(node)
    for start in starts
      for end in ends
        @addEdge(start, end)

  severOuts: (node) ->
    outs = []
    @forEachOut(node, (x, y) -> outs.push(y))
    outs.reverse()
    _.each outs, (o) =>
      @deleteConnected(o)
    outs

  severIns: (node) ->
    ins = []
    @forEachIn(node, (x, y) -> ins.push(y))
    ins.reverse()
    _.each ins, (o) =>
      @deleteConnected(o)
    ins

  outFrom: (node) ->
    @_outs[node] || []

  inTo: (node) ->
    @_ins[node] || []

  isEdge: (a, b) ->
    b in @outFrom(a)

  addEdge: (from, to) ->
    @add(from)
    @add(to)
    @_link(from, @_outs, to)
    @_link(to, @_ins, from)

  removeEdge: (from, to) ->
    @_unlink(from, @_outs, to)
    @_unlink(to, @_ins, from)

  hasConnections: (node) ->
    @_outs[node]? or @_ins[node]?

  isDetached: (node) ->
    @isMember(node) && !@hasConnections(node)

  forEachIn: (node, f) ->
    return unless @isMember(node)
    @_follow(node, @_ins, f)

  forEachOut: (node, f) ->
    return unless @isMember(node)
    @_follow(node, @_outs, f)

  commonPredecessor: (a, b) ->
    path = []
    @forEachIn(a, (x, y) ->
      path.push(y)
    )
    common = null
    @forEachIn(b, (x, y) ->
      if y in path
        common = y
        false
    )
    common

  commonDescendant: (a, b) ->
    path = []
    @forEachOut(a, (x, y) ->
      path.push(y)
    )
    common = null
    @forEachOut(b, (x, y) ->
      if y in path
        common = y
        false
    )
    common

  withoutOutgoing: ->
    _.filter(@all(), (n) =>
      @outFrom(n).length == 0
    )

  withoutIncoming: ->
    _.filter(@all(), (n) =>
      @inTo(n).length == 0
    )

  _follow: (from, map, f, seen = {}, last = null) ->
    return if f(last, from) == false
    seen[from] = PRESENT
    follow = map[from]
    if follow?
      for to in follow
        @_follow(to, map, f, seen, from) unless seen[to] is PRESENT

  _link: (from, map, to) ->
    to_list = map[from]
    if to_list?
      to_list.push(to) unless to in to_list
    else
      map[from] = [to]

  _unlink: (from, map, to) ->
    to_list = map[from]
    if to_list?
      index = to_list.indexOf(to)
      to_list.splice(index, 1) if index > -1
      delete map[from] if to_list.length == 0

class DirectedObjectGraph

  constructor: (keys = new Keys()) ->
    @keys = keys
    @g = new DirectedGraph()

  toString: ->
    @g.toString((x) => @keys.value(x).toString())

  add : (node) ->
    @g.add(@keys.key(node))

  all : ->
    @keys.value(@g.all())

  size : ->
    @g.size()

  find : (key) ->
    @keys.value(key)

  isMember : (node) ->
    @g.isMember(@keys.key(node))

  deleteUnconnected: (node) ->
    @g.deleteUnconnected(@keys.key(node))
    @keys.remove(node)

  deleteConnected: (node) ->
    @g.deleteConnected(@keys.key(node))
    @keys.remove(node)

  severOuts: (node) ->
    removed = @keys.value(@g.severOuts(@keys.key(node)))
    _.each(removed, (r) => @keys.remove(r))

  severIns: (node) ->
    removed = @keys.value(@g.severIns(@keys.key(node)))
    _.each(removed, (r) => @keys.remove(r))

  splice: (node) ->
    @g.splice(@keys.key(node))
    @keys.remove(node)

  outFrom: (node) ->
    @keys.value(@g.outFrom(@keys.key(node)))

  inTo: (node) ->
    @keys.value(@g.inTo(@keys.key(node)))

  isEdge: (a, b) ->
    @g.isEdge(@keys.key([a,b])...)

  addEdge: (from, to) ->
    @g.addEdge.apply(@g, @keys.key([from, to]))

  removeEdge: (from, to) ->
    @g.removeEdge.apply(@g, @keys.key([from, to]))

  hasConnections: (node) ->
    @g.hasConnections(@keys.key(node))

  isDetached: (node) ->
    @g.isDetached(@keys.key(node))

  forEachIn: (node, f) ->
    g = (k,l) => f.apply(this, @keys.value([k,l]))
    @g.forEachIn(@keys.key(node), g)

  forEachOut: (node, f) ->
    g = (k,l) => f.apply(this, @keys.value([k,l]))
    @g.forEachOut(@keys.key(node), g)

  commonDescendant: (a, b) ->
    @keys.value(@g.commonDescendant.apply(@g, @keys.key([a,b])))

  commonPredecessor: (a, b) ->
    @keys.value(@g.commonPredecessor.apply(@g, @keys.key([a,b])))

  withoutOutgoing: ->
    @keys.value(@g.withoutOutgoing())

  withoutIncoming: ->
    @keys.value(@g.withoutIncoming())

exports.DirectedGraph = DirectedGraph
exports.DirectedObjectGraph = DirectedObjectGraph