var _ = require('lodash')
var fs = require('fs')
var shell = require('shelljs')
var path = require('path')

var start = require('./index')
var startWithPM2 = require('binder-utils').startWithPM2

/**
 * The argument-parsing and action components of a CLI command are separated so that the CLI
 * can both be imported from other modules and launched via PM2
 */
function Command (name, cli, action) {
  if (!(this instanceof Command)) {
    return new Command(name, cli, action)
  }
  this.name = name
  this.cli = cli
  this.action = action
}

/**
 * Add an action for this command to the main program
 *
 * @param {Program} program - main commander program
 */
Command.prototype.makeAction = function (program) {
  program.command(this.name)
  this.cli(program)
  program.action(this.action)
  return program
}

var makeCommands = function () {
  var commands = [
    Command('start', function (program) {
      program
        .description('Start the binder-web server')
        .option('-a, --api-key <key>', 'Binder API key')
        .option('-c, --config <file>', 'module configuration file')
        .option('-p, --port <port>', 'binder-web server port')
      return program
    }, function (options) {
      console.log('Starting the binder-web server...')
      var opts = {}
      if (options.config) {
        _.merge(opts, JSON.parse(fs.readFileSync(path.resolve(options.config))))
      } if (options.port) {
        opts.port = options.port
      } if (process.env['BINDER_API_KEY']) {
        opts.apiKey = process.env['BINDER_API_KEY']
      } if (options.apiKey) {
        opts.apiKey = options.apiKey
      }
      start(opts)
    }),
    Command('stop', function (program) {
      program
        .description('Stop the binder-web server')
      return program
    }, function (options) {
      console.log('Stopping the binder-web server...')
      shell.exec('pm2 delete binder-web-start')
    })
    // TODO: add any module-specific commands here
  ]
  return commands
}

var setupProgram = function (commands, program) {
  _.forEach(commands, function (cmd) {
    var command = program.command(cmd.name)
    command = cmd.cli(command)
    command.action(cmd.action)
  })
}

var pm2CLI = function (program) {
  if (!program) {
    program = require('commander')
  }
  // Replace all actions with PM2 subprocess creation
  var pm2Commands = _.map(makeCommands(), function (cmd) {
    if (cmd.name === 'start') {
      cmd.action = function (options) {
        console.log('Starting the binder-web server...')
        startWithPM2({
          name: 'binder-web-' + cmd.name,
          script: path.join(__dirname, 'cli.js'),
          args: process.argv.slice(2)
        })
      }
    }
    return cmd
  })
  setupProgram(pm2Commands, program)
  return program
}

var standaloneCLI = function (program) {
  if (!program) {
    program = require('commander')
  }
  setupProgram(makeCommands(), program)
  return program
}

if (require.main === module) {
  var program = standaloneCLI()
  program.parse(process.argv)
} else {
  module.exports = {
    standaloneCLI: standaloneCLI,
    pm2CLI: pm2CLI
  }
}
