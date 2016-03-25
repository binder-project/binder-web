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
      paddingRight: '2.5%',
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
      cursor: 'pointer'
    }
  }

  return hx`
  <div style=${style.container}>
    <span style='margin-left: 10%; margin-right: 5%'>go</span>
    <button style=${style.button} className='button' onclick=${onclick}>back</button>
  </div>`
}
