var hxdx = require('hxdx')
var hx = hxdx.hx
var dx = hxdx.dx
var actions = require('../../reducers/actions')

var getOrigin = function () {
  var port = window.location.port
  var origin = window.location.hostname
  if (port) {
    origin = origin + ':' + port
  }
  return 'http://' + origin
}
var apiServer = getOrigin()

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
    var src = apiServer + '/logs/' + item.name + '/' + item['start-time']
    return hx`<iframe style=${style.iframe} src=${src}></iframe>`
  }

  return hx`
  <div style=${style.container}>
    ${generateMessages()}
  </div>`
}
