var SocketIO = require('socket.io-client')
var css = require('dom-css')

var style = {
  container: {
    marginLeft: '2.5%',
    marginTop: '5px'
  },
  logs: {
    fontSize: '90%',
    fontFamily: 'Hack',
    color: 'rgb(80,80,80)'
  },
}

function getOrigin () {
  var port = window.location.port
  var origin = window.location.hostname
  if (port) {
    origin = origin + ':' + port
  }
  return origin
}
var host = getOrigin()

var params = window.location.pathname.replace('/logs/', '')
var parts = params.split('/')
var app = parts[0]
var after = parts[1]

var container = document.createElement('div')
css(container, style.container)
document.body.appendChild(container)

var socket = SocketIO(host)
socket.on('connect', function () {
  console.log('connection opened')
  socket.send(JSON.stringify({
    app: app,
    after: after
  }))
})

socket.on('message', function (data, flags) {
  var line = document.createElement('div')
  css(line, style.logs)
  line.innerHTML = data
  container.appendChild(line)
})

socket.on('error', function (err) {
  var line = document.createElement('div')
  css(line, style.logs)
  line.innerHTML = 'error retrieving logs'
  container.appendChild(line)
})
