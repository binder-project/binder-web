var fs = require('fs')
var path = require('path')

var fileName1 = 'web.conf'
var fileName2 = 'cors.conf'

var binderDir = path.join(process.env['HOME'], '.binder')

var src1 = path.join(__dirname, '..', 'conf', 'main.json')
var dst1 = path.join(binderDir, fileName1)

var src2 = path.join(__dirname, '..', 'conf', 'cors.json')
var dst2 = path.join(binderDir, fileName2)

var dirExists = fs.existsSync(binderDir)
var fileExists1 = fs.existsSync(dst1)
var fileExists2 = fs.existsSync(dst2)

if (!dirExists) {
  fs.mkdirSync(binderDir)
}

if (!fileExists1) {
  fs.createReadStream(src1).pipe(fs.createWriteStream(dst1))
}

if (!fileExists2) {
  fs.createReadStream(src2).pipe(fs.createWriteStream(dst2))
}
