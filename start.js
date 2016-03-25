var program = require('commander')
var cli = require('./server/cli.js')

program
  .version('1.0.0')

cli.standaloneCLI(program)
console.log('process.argv: ' + process.argv)
if (process.argv.length === 2) program.help()
program.parse(process.argv)


