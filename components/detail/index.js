var hx = require('hxdx').hx
var back = require('./back')
var more = require('./more')
var logs = require('./logs')
var progress = require('./progress')
var badge = require('./badge')
var template = require('./template')
var info = require('./info')

module.exports = function (selection) {
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

  return hx`
  <div style=${style.container}>
    <div style=${style.top}>
      ${back()}
      ${info(selection.entry)}
      ${more()}
    </div>
    <div style=${style.bottom}>
      ${progress(selection.entry.stage)}
      ${logs(selection.logs)}
      <div style=${style.side}>
        ${badge(selection.entry)}
        ${template(selection.entry)}
      </div>
    </div>
  </div>`
}