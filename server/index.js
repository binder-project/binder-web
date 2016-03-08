var path = require('path')

var binder = require('./binder')
var express = require('express')
var app = express()

var port = 3000
var staticPath = path.join(__dirname, '../public')

app.use(express.static(staticPath))

// Public endpoints
app.get('/', function (req, res) {
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
 * Deploy a binder
 */
app.get('/:templateName', function (req, res) {
  var name = req.params.templateName
  binder.getOneTemplate(name, function (err, template) {
    if (err) return res.status(500).end()
    return res.json(template)
  })
})

// API endpoints

app.get('/api/overview', function (req, res) {
  binder.getOverview(function (err, overview) {
    if (err) return res.status(500).send('could not get overview list')
    return res.json(overview)
  })
})

app.get('/api/templates/:templateName', function (req, res) {
  var name = req.params.templateName
  binder.getOneTemplate(name, function (err, template) {
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
  var name = req.json['image-name']
  binder.startBuild(name, function (err, status) {
    if (err) return res.status(500).send('could not build binder')
    return res.json(status)
  })
})

console.log('Listening on port', port, '...')
app.listen(port)

