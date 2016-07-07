var hx = require('hxdx').hx
var dx = require('hxdx').dx
var actions = require('../../reducers/actions')
var href = require('sheet-router/href')
var router = require('../../router')
var theme = require('../../theme')

module.exports = function (entry) {

  function onclick () {
    href(function (link) {router(link)})
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
      right: '1%',
      position: 'absolute',
      display: 'inline-block',
      width: '40%'
    },
    name: {
      display: 'inline-block',
      cursor: 'pointer',
      fontSize: '140%',
      color: 'rgb(90,90,90)'
    },
    icon: {
      display: 'inline-block',
      marginLeft: '5%',
      verticalAlign: 'top',
      marginTop: '-10px'
    },
    iconLabel: {
      color: 'rgb(150,150,150)',
      fontSize: '100%',
      marginTop: '-5px'
    },
    status: {
      backgroundColor: color(entry.status),
      borderRadius: '8px',
      width: '20px',
      height: '20px',
      display: 'block',
      marginRight: '12px',
      marginLeft: '12px',
      marginTop: '6px'
    },
    deployed: {
      fontFamily: 'ClearSans-Medium',
      marginRight: '14px',
      width: '20px',
      display: 'block',
      marginTop: '3px',
      marginLeft: '18px'
    },
    rebuild: {
      marginRight: '12px',
      display: 'block',
      cursor: 'pointer',
      marginTop: '3px'
    },
    launch: {
      marginRight: '12px',
      display: 'block',
      cursor: 'pointer',
      marginTop: '3px'
    }
  }

  var launchUrl = function () {
    return '/repo/' + displayName()
  }

  var submitUrl = function () {
    return '/status/' + displayName()
  }

  var rebuild = function () {
    href(function (link) {router(link)})
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

  var deployed = function () {
    if (entry.deployed) {
      return hx`<div style=${style.icon}><span style=${style.iconLabel}>deployed</span><span style=${style.deployed}>${entry.deployed}</span></div>`
    }
  }

  return hx`
  <div style=${style.container}>
    <a href=${'/status/' + displayName()}><div style=${style.name} className='label' onclick=${onclick}>${displayName()}</div></a>
    <div style=${style.group}>
      ${deployed()}
      <div style=${style.icon}><span style=${style.iconLabel}>status</span><span style=${style.status}></span></div>
      <div style=${style.icon}><span style=${style.iconLabel}>rebuild</span><a href='${submitUrl()}'><span onclick=${rebuild} style=${style.rebuild}><img className='action-icon' src='/assets/images/refresh.svg'></span></a></div>
      <div style=${style.icon}><span style=${style.iconLabel}>launch</span><a href='${launchUrl()}' style=${style.launch}><img className='action-icon' src='/assets/images/launch.svg'></a></div>
    </div>
  </div>`
}
