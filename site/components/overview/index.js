var hx = require('hxdx').hx
var connect = require('hxdx').connect

var build = require('./build.js')
var search = require('./search.js')
var welcome = require('./welcome.js')
var guide = require('./guide.js')
var list = require('./list.js')
var conf = require('../../../conf/main.json')

var overview = function (state) {
  if (conf.public) {
    return hx`
    <div>
      ${welcome()}
      ${build()}
      ${guide()}
    </div>`
  } else {
    return hx`
    <div>
      ${build()}
      ${search()}
      ${list(state.filter, state.model)}
    </div>`
  } 
}

module.exports = connect({
  model: 'model',
  filter: 'filter'
}, overview)
