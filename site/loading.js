var async = require('async')
var css = require('dom-css')
var startsWith = require('lodash.startswith')
var request = require('request')

var height = window.innerHeight

var style = {
  header: {
    width: '80%',
    height: '125px',
    marginLeft: '10%',
    marginRight: '10%',
    textAlign: 'center',
    marginBottom: '3%',
    marginTop: '3%'
  },
  main: {
    width: '80%',
    marginLeft: '10%',
    marginRight: '10%',
    textAlign: 'center',
    position: 'relative'
  },
  footer: {
    width: '80%',
    marginLeft: '10%',
    marginRight: '10%',
    textAlign: 'center',
    position: 'relative',
    marginTop: '50px'
  },
  template: {
    textDecoration: 'none',
    fontSize: '200%'
  },
  logo: {
    width: '350px'
  },
  loader: {
    width: height * 0.5 + 'px',
    height: height * 0.5 + 'px',
    borderRadius: height * 0.25 + 'px'
  },
  messageContainer: {
    width: '26%',
    marginLeft: '37%',
    marginRight: '37%',
    position: 'absolute',
    top: '40%'
  },
  message: {
    textAlign: 'center',
    fontFamily: 'ClearSans-Medium',
    fontSize: '300%',
    color: 'rgb(150,150,150)',
    lineHeight: '1em',
    transition: 'color 0.7s'
  },
  messageDots: {
    textAlign: 'center',
    fontFamily: 'ClearSans-Medium',
    fontSize: '300%',
    color: 'rgb(150,150,150)',
    marginTop: '-30px'
  }
}

function getOrigin () {
  var port = window.location.port
  var origin = window.location.hostname
  if (port) {
    origin = origin + ':' + port
  }
  return 'http://' + origin
}

var apiServer = getOrigin()

var displayName = window.location.pathname.replace('/repo', '').slice(1)

// add logo
var header = document.createElement('div')
var img = document.createElement('img')
img.src='/assets/images/logo.svg'
css(header, style.header)
css(img, style.logo)
document.body.appendChild(header)
header.appendChild(img)

// add main loading element
var main = document.createElement('div')
document.body.appendChild(main)
css(main, style.main)
var loader = document.createElement('div')
loader.className = 'three-quarters-loader-big'
css(loader, style.loader)
main.appendChild(loader)
var messageContainer = document.createElement('div')
css(messageContainer, style.messageContainer)
main.appendChild(messageContainer)
var message = document.createElement('div')
message.innerHTML = 'loading'
css(message, style.message)
messageContainer.appendChild(message)
var messageDots = document.createElement('div')
messageDots.innerHTML = ''
css(messageDots, style.messageDots)
messageContainer.appendChild(messageDots)

// add repo information
var footer = document.createElement('div')
var template = document.createElement('a')
css(footer, style.footer)
template.innerHTML = displayName
template.href = displayName
template.className = 'template-link'
css(template, style.template)
document.body.appendChild(footer)
footer.appendChild(template)

var counter = 0

var makeProgress = function () {
  if (counter == 0) messageDots.innerHTML = '.'
  if (counter == 1) messageDots.innerHTML = '..'
  if (counter == 2) messageDots.innerHTML = '...'
  if (counter == 2) counter = 0
  else counter += 1
}

var makeError = function (err) {
  message.innerHTML = 'failed!'
  messageDots.innerHTML = ''
  css(message, {color: 'rgb(220, 80, 50)'})
  css(loader, {border: '30px solid rgb(220, 80, 50)'})
}

var makeSuccess = function () {
  message.innerHTML = 'ready!'
  messageDots.innerHTML = ''
  css(message, {color: 'rgb(91,186,71)'})
  css(loader, {border: '30px solid rgb(91,186,71)'})
}

var templateName = displayName.replace(/\//g, '-')
async.waterfall([
  function (next) {
    request({
      url: apiServer + '/api/deploy/' + templateName,
      json: true
    }, function (err, res, json) {
      if (err) {
        makeError(err)
      }
      return next(null, json['id'])
    })
  },
  function (deployId, next) {
    async.retry({ times: 60, interval: 1000 }, function (next) {
      makeProgress()
      request({
        url: apiServer + '/api/apps/' + templateName + '/' + deployId,
        json: true
      }, function (err, res, json) {
        var location  = json['location']
        var status = json['status']
        if (location) {
          if (!startsWith(location, 'http://')) {
            location = 'http://' + location
          }
          makeSuccess()
          window.location.href = location
        } else if (status === 'failed') {
          makeError()
          return next('try again')
        }
      })
    }, function (err) {
      return next(new Error('deployment timed out'))
    })
  }
], function (err) {
  if (err) {
    makeError(err)
  }
})
