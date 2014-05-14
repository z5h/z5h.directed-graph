_ = require('underscore')

class Keys

  constructor : (keyFor = (x) -> x) ->
    @keyForValue = keyFor
    @keyToValue = {}

  keyPresent : (key) ->
    @keyToValue[key] != undefined

  valuePresent : (o) ->
    @keyToValue[@keyForValue(o)] != undefined

  add : (o) ->
    return null unless o
    key = @keyForValue(o)
    @keyToValue[key] = o
    key

  remove : (o) ->
    return null unless o
    delete @keyToValue[@keyForValue(o)]

  _key : (value) ->
    @add(value)

  _value : (key) ->
    return null unless key
    @keyToValue[key]

  key : (values) ->
    if Array.isArray(values) then _.map(values, (x) => @_key(x)) else @_key(values)

  value : (keys) ->
    if Array.isArray(keys) then _.map(keys, (x) => @_value(x)) else @_value(keys)

  exportKeyFunction : () ->
    (v) => @key(v)

  exportValueFunction : () ->
    (k) => @value(k)

exports.Keys = Keys