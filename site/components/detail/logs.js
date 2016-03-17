var hxdx = require('hxdx')
var hx = hxdx.hx
var dx = hxdx.dx
var actions = require('../../reducers/actions')

module.exports = function (state) {
  console.log('startTime: ' + state.entry.startTime)

  var onload = function () {
    var entry = state.entry
    return actions.logs(entry.name, entry.startTime)(dx)
  }

  var style = {
    container: {
      width: '55%',
      height: '82%',
      padding: '2%',
      marginLeft: '2%',
      marginRight: '2%',
      display: 'inline-block',
      verticalAlign: 'top',
      borderRadius: '8px',
      border: 'solid 5px rgb(210, 210, 210)',
      fontFamily: 'Hack'
    },
    logs: {
      fontSize: '90%',
      marginLeft: '2.5%',
      width: '95%',
      height: '100%',
      overflowY: 'auto',
      whiteSpace: 'pre'
    }
  }

  return hx`
  <div style=${style.container}>
    <button onclick=${onload}>Start logs</button>
    <div style=${style.logs}>
      ${state.logs.msgs}
    </div>
  </div>`
}
