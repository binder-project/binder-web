var hxdx = require('hxdx')
var hx = hxdx.hx
var dx = hxdx.dx
var actions = require('../../reducers/actions')
var request = require('request')

var getOrigin = function () {
  var port = window.location.port
  var origin = window.location.hostname
  if (port) {
    origin = origin + ':' + port
  }
  return window.location.protocol + '//' + origin
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
      border: 'solid 5px rgb(210, 210, 210)',
      position: 'relative'
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

  function download () {
    request({
      method: 'GET',
      url: apiServer + '/api/logs/' + item.name + '/' + item['start-time'],
      json: true
    }, function (err, rsp, body) {
      var payload = []
      rsp.body.forEach(function (log) {
        if (!(log._source.message == '')) payload.push(log._source.message)
      })
      var el = document.querySelector('#logs-download-link')
      el.download = item['display-name'] + '.txt'
      el.href = 'data:application/text,' + encodeURIComponent(payload.join('\r\n'))
      el.click()
    })
  }

  function generate () {
    if (item['start-time']) {
      var src = apiServer + '/logs/' + item.name + '/' + item['start-time']
      return hx`<iframe style=${style.iframe} src=${src}></iframe>`
    }
  }

  return hx`
  <div style=${style.container}>
    ${generate()}
    <span onclick=${download} className='btn btn-download' id='logs-download'>download</span>
    <a style='display: none' id='logs-download-link'></a>
  </div>`
}
