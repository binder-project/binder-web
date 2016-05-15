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
      height: '500px'
    },
    top: {
      height: '25%'
    },
    bottom: {
      height: '75%'
    }
  }

  var id = state.selection
  var item = state.entries[id]

  if (!item) {
    return hx`
    <div style=${style.container}>
      <div style=${style.top}>
        <div style='text-align: center'>
          <div style='margin-top: 175px;' className='three-quarters-loader'></div>
        </div>
      </div>
    </div>
    `
  } else {
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
        ${badge(item)}
      </div>
    </div>`
  }
}

module.exports = connect({ 
  selection: 'selection',
  entries: 'model.entries'
}, detail)
