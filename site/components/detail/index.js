var hx = require('hxdx').hx
var connect = require('hxdx').connect

var back = require('./back')
var more = require('./more')
var logs = require('./logs')
var progress = require('./progress')
var badge = require('./badge')
var template = require('./template')
var info = require('./info')

var detail = function (state) {
  var style = {
    container: {
      width: '100%',
      borderRadius: '8px',
      height: '450px'
    },
    top: {
      height: '25%'
    },
    bottom: {
      height: '75%'
    },
    side: {
      width: '15.5%',
      height: '100%',
      display: 'inline-block'
    }
  }

  var id = state.selection
  var item = state.entries[id]

  return hx`
  <div style=${style.container}>
    <div style=${style.top}>
      ${back()}
      ${info(item)}
      ${more()}
    </div>
    <div style=${style.bottom}>
      ${progress(item)}
      ${logs(item)}
      <div style=${style.side}>
        ${badge(item)}
        ${template(item)}
      </div>
    </div>
  </div>`
}

module.exports = connect({ 
  selection: 'selection',
  entries: 'model.entries'
}, detail)
