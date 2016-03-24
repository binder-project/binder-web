var hxdx = require('hxdx')
var hx = hxdx.hx
var dx = hxdx.dx
var actions = require('../../reducers/actions')

module.exports = function (item) {

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

  function generateMessages () {
    if ((item.stage === 'completed') || (item.stage === 'failed')) {
      if (item.logs) {
        return hx`${item.logs.join('\n')}`
      }
      return 'Loading logs...'
    }
    return hx`<span>Logs will be displayed once building has finished.</span>`
  }

  return hx`
  <div style=${style.container}>
    <div style=${style.logs}>
      ${generateMessages()}
    </div>
  </div>`
}
