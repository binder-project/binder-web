var hxdx = require('hxdx')
var hx = hxdx.hx
var dx = hxdx.dx
var actions = require('../../reducers/actions')

var apiServer = 'http://localhost:3000'

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
      border: 'solid 5px rgb(210, 210, 210)'
    },
    logs: {
      fontSize: '90%',
      marginTop: '5px',
      marginLeft: '2.5%',
      width: '95%',
      height: '95%',
      overflowY: 'auto',
      fontFamily: 'Hack',
      color: 'rgb(80,80,80)',
      wordWrap: 'break-word'
    },
    iframe: {
      border: 'none',
      width: '100%',
      height: '95%'
    }
  }

  function generateMessages () {
    if ((item.stage === 'completed') || (item.stage === 'failed')) {
      if (item.logs) {
        return hx`<div style=${style.logs}>
          ${hx`<pre style='white-space: pre-wrap; margin: 0'>${item.logs.join('\n')}</pre>`}
        </div>`
      }
      return hx`<div style=${style.logs}>loading logs...</div>`
    }
    var src = apiServer + '/logs/' + item.name + '/' + item.startTime
    return hx`<iframe style=${style.iframe} src=${src}></iframe>`
  }

  return hx`
  <div style=${style.container}>
    ${generateMessages()}
  </div>`
}
