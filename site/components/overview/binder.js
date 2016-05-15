var hx = require('hxdx').hx
var dx = require('hxdx').dx
var actions = require('../../reducers/actions')
var theme = require('../../theme')

module.exports = function (entry) {

  function onclick () {
    actions.showDetail(entry.name, entry.build['start-time'])(dx)
  }

  var color = function (status) {
    switch (status) {
      case 'building':
        return theme.ORANGE
      case 'pending':
        return theme.ORANGE
      case 'loading':
        return theme.ORANGE
      case 'completed':
        return theme.GREEN
      case 'running':
        return theme.ORANGE
      case 'failed':
        return theme.RED
      default:
        return theme.ORANGE
    }
  }

  var style = {
    container: {
      display: '',
      marginBottom: '2%',
      position: 'relative'
    },
    group: {
      textAlign: 'right',
      right: '2%',
      position: 'absolute',
      display: 'inline-block',
      width: '30%'
    },
    name: {
      display: 'inline-block',
      cursor: 'pointer'
    },
    status: {
      backgroundColor: color(entry.status),
      borderRadius: '8px',
      width: '20px',
      height: '20px',
      display: 'inline-block',
      marginRight: '14px'
    },
    deployed: {
      fontFamily: 'ClearSans-Medium',
      marginRight: '14px',
      width: '20px',
      verticalAlign: 'super'
    },
    rebuild: {
      marginRight: '10px',
      cursor: 'pointer'
    },
    launch: {
      marginRight: '5px'
    }
  }

  var launchUrl = function () {
    return '/repo/' + entry.name
  }

  var rebuild = function () {
    if (entry.repo) {
      return actions.submitBuild(entry.repo)(dx)
    }
    if (entry.build) {
      return actions.submitBuild(entry.build.repository)(dx)
    }
  }

  var displayName = function () {
    if (entry['display-name']) {
      return entry['display-name']
    }
    if (entry.build) {
      return entry.build['display-name']
    }
    return ''
  }

  return hx`
  <div style=${style.container}>
    <a href=${'/status/' + displayName()}><div style=${style.name} className='label' onclick=${onclick}>${displayName()}</div></a>
    <div style=${style.group}>
      <span style=${style.deployed}>${entry.deployed}</span>
      <span style=${style.status}></span>
      <span onclick=${rebuild} style=${style.rebuild}><img className='action-icon' src='/assets/images/refresh.svg'></span>
      <a href='${launchUrl()}' style=${style.launch}><img className='action-icon' src='/assets/images/launch.svg'></a>
    </div>
  </div>`
}
