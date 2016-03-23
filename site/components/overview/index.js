var hx = require('hxdx').hx
var connect = require('hxdx').connect

var build = require('./build.js')
var search = require('./search.js')
var list = require('./list.js')

var overview = function (state) {
  return hx`
  <div>
    ${build()}
    ${search()}
    ${list(state.filter, state.model)}
  </div>`
}

module.exports = connect({
  model: 'model',
  filter: 'filter'
}, overview)
