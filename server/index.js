var path = require('path')

var express = require('express')
var expressWs = require('express-ws')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var assign = require('object-assign')

var settings = require('./settings')

var port = 3000
var staticPath = path.join(__dirname, '../public')

app.use(express.static(staticPath))
app.use(bodyParser.json())

// set once the server is started
var binder = null

// Public endpoints
app.get('/', function (req, res) {
  return res.sendFile(path.join(staticPath, 'index.html'))
})

app.get('/:templateName', function (req, res) {
  return res.sendFile(path.join(staticPath, 'loading.html'))
})

app.get('/:templateName/status', function (req, res) {
  return res.sendFile(path.join(staticPath, 'index.html'))
})

/*
 * Display a loading screen for a building binder
 */
app.get('/loading/:imageName', function (req, res) {
  var name = req.params.imageName
  binder.getBuildStatus(name, function (err, status) {
    if (err) return res.status(500).end()
    return res.json(status)
  })
})

/*
 * Deploy a binder and get information about a deployment
 */
app.get('/api/deploy/:templateName', function (req, res) {
  var name = req.params.templateName
  binder.deployBinder(name, function (err, status) {
    if (err) return res.status(500).end()
    return res.json(status)
  })
})

app.get('/api/apps/:templateName/:id', function (req, res) {
  var name = req.params.templateName
  var id = req.params.id
  binder.getDeployStatus(name, id, function (err, status) {
    if (err) return res.status(500).end()
    return res.json(status)
  })
})

// API endpoints

app.get('/api/overview', function (req, res) {
  binder.getOverview(function (err, overview) {
    console.log(err)
    if (err) return res.status(500).send('could not get overview list')
    return res.json(overview)
  })
})

app.get('/api/templates/:templateName', function (req, res) {
  var name = req.params.templateName
  binder.getFullTemplate(name, function (err, template) {
    if (err) return res.status(500).send('could not get template')
    return res.json(template)
  })
})

app.get('/api/builds/:imageName', function (req, res) {
  var name = req.params.imageName
  binder.getBuildStatus(name, function (err, status) {
    if (err) return res.status(500).send('could not get build status')
    return res.json(status)
  })
})

app.post('/api/builds', function (req, res) {
  var repo = req.body['repo']
  binder.startBuild(repo, function (err, status) {
    if (err) return res.status(500).send('could not build binder')
    return res.json(status)
  })
})

app.get('/api/logs/:templateName/:after', function (req, res) {
  var name = req.params.templateName
  var after = req.params.after
  binder.getLogs(name, after, function (err, logs) {
    if (err) return res.status(500).send('could not fetch logs')
    return res.json(logs)
  })
})

io.on('connection', function (ws) {
  // TODO: probably don't need any auth here, but double-check
  console.log('got a connection')
  var stream = null
  ws.on('message', function incoming(msg) {
    console.log('received message: ' + msg)
    try {
      var json = JSON.parse(msg)
      var app = json.app
      var after = json.after
      if (app) {
        console.log('streaming build logs for', app, 'after', after)
        stream = binder.streamBuildLogs(app, after)
        stream.on('data', function (data) {
          ws.send(data)
        })
        stream.resume()
      }
    } catch (e) {
      console.error('build logs websocket failed: ' + e)
    }
  })
  ws.on('error', function (err) {
    console.error('build logs websocket failed: ' + e)
    if (stream) stream.destroy()
  })
  ws.on('close', function () {
    if (stream) stream.destroy()
  })
})

var processOptions = function (name, options) {
  if (!options) {
    return {}
  }
  if (name in options) {
    var limited = options[name]
    limited.logging = options.logging
    limited.db = options.db
    limited.name = name
    for (var key in options) {
      if (!(typeof options[key] === 'object') && key !== name) {
        limited[key] = options[key]
      }
    }
    return limited
  }
  return options
}

var start = function (opts) {
  var self = this
  this.opts = assign(settings, processOptions('binder-web', opts))
  console.log('this.opts:', this.opts)
  binder = require('./binder')(this.opts)
  http.listen(this.opts.port, function () {
    console.log('Listening on port', self.opts.port, '...')
  })
}

module.exports = start
