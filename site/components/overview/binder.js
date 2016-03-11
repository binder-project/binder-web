var hx = require('hxdx').hx
var dx = require('hxdx').dx
var ax = require('../../reducers/actions')

module.exports = function (entry) {
  function onclick () {
    dx({ type: 'SHOW_DETAIL', entry: entry })
    ax.logs()(dx)
  }

  var color = function (stage) {
    switch (stage) {
      case 'building':
        return 'rgb(243,162,83)'
      case 'completed':
        return 'rgb(91,186,71)'
      case 'error':
        return 'rgb(208,102,129)'
    }
  }

  var style = {
    container: {
      display: entry.visible ? '' : 'none',
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
    stage: {
      backgroundColor: color(entry.stage),
      borderRadius: '8px',
      width: '20px',
      height: '20px',
      display: 'inline-block',
      marginRight: '10px',
      verticalAlign: 'bottom'
    },
    deployed: {
      fontFamily: 'ClearSans-Medium',
      marginRight: '10px',
      width: '20px'
    },
    rebuild: {
      marginRight: '10px',
    },
    launch: {
      marginRight: '5px',
    }
  }

  return hx`
  <div style=${style.container}>
    <div style=${style.name} className='label' onclick=${onclick}>${entry.name}</div>
    <div style=${style.group}>
      <span style=${style.deployed}>${entry.deployed}</span>
      <span style=${style.stage}></span>
      <span style=${style.rebuild}>R</span>
      <span style=${style.launch}>L</span>
    </div>
  </div>`
}
