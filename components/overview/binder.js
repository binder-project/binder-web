var hx = require('hxdx').hx
var dx = require('hxdx').dx

module.exports = function (state) {
  var color = function (stage) {
    switch (stage) {
      case 'building':
        return 'rgb(91,186,71)'
      case 'deployed':
        return 'rgb(243,162,83)'
      case 'error':
        return 'rgb(208,102,129)'
    }
  }

  var style = {
    container: {
      display: state.visible ? '' : 'none',
      marginBottom: '2%'
    },
    group: {
      textAlign: 'right',
      display: 'inline-block',
      width: '30%'
    },
    name: {
      width: '65%',
      display: 'inline-block'
    },
    stage: {
      backgroundColor: color(state.stage),
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
    <div style=${style.name} onclick=${onclick}>${state.name}</div>
    <div style=${style.group}>
      <span style=${style.deployed}>${state.deployed}</span>
      <span style=${style.stage}></span>
      <span style=${style.rebuild}>R</span>
      <span style=${style.launch}>L</span>
    </div>
  </div>`
}