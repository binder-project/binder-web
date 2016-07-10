var css = require('dom-css')
var ismobile = require('is-mobile')()
var request = require('request')

var style = {
  header: {
    width: '80%',
    marginLeft: '10%',
    marginRight: '10%',
    textAlign: 'center',
    marginBottom: '3%',
    marginTop: '3%'
  },
  logo: {
    width: ismobile ? '275px' : '375px',
    marginBottom: '0px'
  },
  title: {
    fontSize: '250%',
    textAlign: 'center',
    color: 'rgb(120,120,120)'
  },
  line: {
    width: '275px',
    marginTop: '50px',
    marginBottom: '50px',
    border: 'dotted 1px rgb(90,90,90)'
  },
  container: {
    border: 'solid 3px rgb(200,201,202)',
    borderRadius: '5px',
    width: ismobile ? '90%' : '50%',
    marginLeft: ismobile ? '5%' : '25%',
    marginTop: '50px',
    paddingTop: '5px'
  },
  row: {
    marginTop: '20px',
    marginBottom: '15px',
    fontSize: ismobile ? '100%' : '150%',
    height: '50px',
    position: 'relative'
  },
  name: {
    color: 'rgb(90,90,90)',
    display: 'inline-block',
    textAlign: 'right',
    position: 'absolute',
    right: '70%',
    textTransform: 'uppercase'
  },
  status: {
    backgroundColor: 'rgb(0,200,0)',
    width: '30px',
    height: '30px',
    borderRadius: '25px',
    display: 'inline-block',
    position: 'absolute',
    left: '40%',
    marginTop: ismobile ? '-5px' : '5px'
  },
  label: {
    color: 'rgb(0,200,0)',
    display: 'inline-block',
    position: 'absolute',
    left: '48%'
  },
  timestamp: {
    color: 'rgb(140,140,140)',
    display: 'inline-block',
    position: 'absolute',
    left: '70%'
  }
}

var header = document.createElement('div')
css(header, style.header)
var logo = document.createElement('img')
logo.src = '/assets/images/logo.svg'
css(logo, style.logo)
header.appendChild(logo)
document.body.appendChild(header)

var title = document.createElement('div')
title.innerHTML = 'system status'
css(title, style.title)
document.body.appendChild(title)

var container = document.createElement('div')
css(container, style.container)

function update (entries) {
  var existing = document.querySelectorAll('.row')
  if (existing) {
    for (var i = 0; i < existing.length; i++) {
      var row = existing[i]
      row.remove()
    }
  }
  entries.forEach(function (entry) {
    var row = document.createElement('div')
    row.className = 'row'
    css(row, style.row)
    var name = document.createElement('div')
    name.innerHTML = entry.name
    css(name, style.name)
    var status = document.createElement('div')
    css(status, style.status)
    var label = document.createElement('div')
    label.innerHTML = entry.status
    css(label, style.label)
    row.appendChild(name)
    row.appendChild(status)
    if (entry.timestamp) {
      var timestamp = document.createElement('div')
      var ts = new Date(entry.timestamp)
      timestamp.innerHTML = ts.toLocaleDateString() + ' ' + ts.toLocaleTimeString()
      css(timestamp, style.timestamp)
      row.appendChild(timestamp)
    }
    if (!ismobile) row.appendChild(label)
    container.appendChild(row)
  })
}

document.body.appendChild(container)

var entries = [
  {
    name: 'build',
    status: '',
    timestamp: ''
  },
  {
    name: 'deploy',
    status: '',
    timestamp: ''
  }
]
update(entries)

function getOrigin () {
  var port = window.location.port
  var origin = window.location.hostname
  if (port) {
    origin = origin + ':' + port
  }
  return 'http://' + origin
}

var apiServer = getOrigin()
request({
  url: apiServer + '/api/health',
  json: true
}, function (err, res, json) {
  if (!err && json) {
    update(json)
  }
})
