var hx = require('hxdx').hx
var connect = require('hxdx').connect

var build = require('./build.js')
var search = require('./search.js')
var list = require('./list.js')

var conf = require('../../../conf/main.json')

function showList (filter, model) {
  if (conf.showOverview) {
    return hx`${list(filter, model)}`
  }
  // TODO: something to display in the list's place?
  return hx``
}

function showSearch () {
  if (conf.showOverview) {
    return hx`${search()}`
  }
  // TODO: something to display in the search bar's place?
  return hx``
}

var overview = function (state) {
  return hx`
  <div>
    ${build()}
    ${showSearch()}
    ${showList(state.filter, state.model)}
  </div>`
}

module.exports = connect({
  model: 'model',
  filter: 'filter'
}, overview)
