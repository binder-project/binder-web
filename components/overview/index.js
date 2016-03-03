var hx = require('hxdx').hx
var build = require('./build.js')
var search = require('./search.js')
var list = require('./list.js')

module.exports = function (state) {
  return hx`
  <div>
    ${build()}
    ${search()}
    ${list(state)}
  </div>`
}