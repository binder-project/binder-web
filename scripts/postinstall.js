var fs = require('fs')
var path = require('path')

var fileName = 'web.conf'

var binderDir = path.join(process.env['HOME'], '.binder')
var src = path.join(__dirname, '../conf/main.json')
var dst = path.join(binderDir, fileName)

var dirExists = fs.existsSync(binderDir)
var fileExists = fs.existsSync(dst)
if (!dirExists) {
  fs.mkdirSync(binderDir)
}
if (!fileExists) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dst))
}
