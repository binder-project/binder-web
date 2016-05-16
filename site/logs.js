var SocketIO = require('socket.io-client')
var css = require('dom-css')

var style = {
  container: {
    marginLeft: '2.5%',
    marginRight: '5%',
    marginTop: '5px',
    wordWrap: 'break-word'
  },
  logs: {
    fontSize: '80%',
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
container.innerHTML = "<div style='text-align: center; margin-top: 20%;'><div class='three-quarters-loader'></div></div>"
document.body.appendChild(container)

var firstTime = true

var socket = SocketIO(host)
socket.on('connect', function () {
  console.log('connection opened')
  socket.send(JSON.stringify({
    app: app,
    after: after
  }))
})

socket.on('message', function (data, flags) {
  if (firstTime) {
    container.innerHTML = ''
    firstTime = false
  }
  var line = document.createElement('div')
  css(line, style.logs)
  line.innerHTML = data
  container.appendChild(line)
})

socket.on('error', function (err) {
  if (firstTime) {
    container.innerHTML = ''
    firstTime = false
  }
  var line = document.createElement('div')
  css(line, style.logs)
  line.innerHTML = 'error retrieving logs'
  container.appendChild(line)
})
