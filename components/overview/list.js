var hx = require('hxdx').hx
var binder = require('./binder')

module.exports = function (state) {
  return hx`<div>${state.map(function (item) {
    return binder(item)
  })}</div>`
}