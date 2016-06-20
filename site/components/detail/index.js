var hx = require('hxdx').hx
var connect = require('hxdx').connect

var back = require('./back')
var more = require('./more')
var logs = require('./logs')
var progress = require('./progress')
var badge = require('./badge')
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
    },
    loader: {
      textAlign: 'center',
      paddingTop: '100px'
    }
  }

  var id = state.selection
  var item = state.entries[id]

  function content () {
    if (!item) {
      return hx`<span>
      <div style=${style.top}>
        <div style=${style.loader}>
          <div className='three-quarters-loader'></div>
        </div>
      </div></span>`
    } else {
      return hx`
      <span>
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
      </span>`
    }
  }

  return hx`<div style=${style.container}>
    ${content()}
  </div>`
}

module.exports = connect({ 
  selection: 'selection',
  entries: 'model.entries'
}, detail)
