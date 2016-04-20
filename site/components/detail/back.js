var hx = require('hxdx').hx
var dx = require('hxdx').dx
var actions = require('../../reducers/actions')

module.exports = function () {
  function onclick () {
    actions.showOverview()(dx)
  }

  var style = {
    container: {
      width: '12%',
      textAlign: 'right',
      left: '0%',
      height: '26%',
      paddingTop: '1.5%',
      paddingBottom: '2.5%',
      paddingLeft: '2%',
      paddingRight: '2%',
      display: 'inline-block',
      verticalAlign: 'top',
      background: 'rgb(210, 210, 210)',
      borderRadius: '8px',
      border: 'solid 5px rgb(210, 210, 210)'
    },
    button: {
      background: 'rgb(255, 255, 255)',
      borderRadius: '8px',
      padding: '12px',
      border: 'none',
      fontSize: '100%',
      cursor: 'pointer',
      verticalAlign: 'top'
    },
    icon: {
      width: '40px'
    }
  }

  return hx`
  <div style=${style.container}>
    <img style=${style.icon} src='/assets/images/back.svg'>
    <button style=${style.button} className='button' onclick=${onclick}> go back</button>
  </div>`
}
