var hx = require('hxdx').hx
var back = require('./back')
var info = require('./info')
var logs = require('./logs')
var progress = require('./progress')
var badge = require('./badge')
var template = require('./template')
var selection = require('./selection')

module.exports = function (state) {
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
      ${selection(state)}
      ${info()}
    </div>
    <div style=${style.bottom}>
      ${progress(state)}
      ${logs(state)}
      <div style=${style.side}>
        ${badge(state)}
        ${template(state)}
      </div>
    </div>
  </div>`
}