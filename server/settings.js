var path = require('path')
var fs = require('fs')
var jsonfile = require('jsonfile')

var optsPath = path.join(process.env['HOME'], '.binder-web.conf')
var defaultOptsPath = path.join(__dirname, '../conf/main.json')
var packagePath = path.join(__dirname, '../package.json')

if (fs.existsSync(optsPath)) {
  var fullSettings = jsonfile.readFileSync(optsPath)
} else {
  var fullSettings = jsonfile.readFileSync(defaultOptsPath)
}
var packageJson = jsonfile.readFileSync(packagePath)
fullSettings.name = packageJson.name

module.exports = fullSettings
