var path = require('path')
var fs = require('fs')

var contents = fs.readFileSync(path.join(process.env['HOME'], '.binder/web.conf'), 'utf8')
module.exports = JSON.parse(contents)
