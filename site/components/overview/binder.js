var hx = require('hxdx').hx
var dx = require('hxdx').dx
var actions = require('../../reducers/actions')

module.exports = function (entry) {

  function onclick () {
    actions.showDetail(entry.name, entry.build['start-time'])(dx)
  }

  var color = function (stage) {
    switch (stage) {
      case 'building':
        return 'rgb(243,162,83)'
      case 'pending':
        return 'rgb(100, 80, 160)'
      case 'loading':
        return 'rgb(87, 154, 203)'
      case 'completed':
        return 'rgb(91,186,71)'
      case 'running':
        return 'rgb(243,162,83)'
      case 'failed':
        return 'rgb(208,102,129)'
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
    stage: {
      backgroundColor: color(entry.stage),
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
      <span style=${style.rebuild}><img src='assets/images/refresh.svg'></span>
      <span style=${style.launch}><img src='assets/images/launch.svg'></span>
    </div>
  </div>`
}
