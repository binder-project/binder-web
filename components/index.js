var hx = require('hxdx').hx
var overview = require('./overview')
var detail = require('./detail')

module.exports = function (state) {
  if (state.selection) {
    return hx`
    <div>
    ${detail(state.selection)}
    </div>
    `
  } else {
    return hx`
    <div>
    ${overview(state.binders)}
    </div>
    `
  }
}