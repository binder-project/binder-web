function getOrigin () {
  var port = window.location.port
  var origin = window.location.hostname
  if (port) {
    origin = origin + ':' + port
  }
  return origin
}

module.exports = {
  getOrigin: getOrigin
}
