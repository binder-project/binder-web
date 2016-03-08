var hx = require('hxdx').hx
var build = require('./build.js')
var search = require('./search.js')
var list = require('./list.js')

module.exports = function (collection) {
  return hx`
  <div>
    ${build()}
    ${search()}
    ${list(collection)}
  </div>`
}