var hx = require('hxdx').hx

module.exports = function (state) { 
  return hx`
  <div style='display: ${state.visible ? 'inherits' : 'none'}'>
  <span>${state.name}</span>
  <span>${state.stage}</span>
  <span>${state.deployed}</span>
  </div>`
}