var hx = require('hxdx').hx
var dx = require('hxdx').dx

module.exports = function (state) {
  function onclick () {
    dx({
      type: 'HIDE_DETAIL'
    })
    dx({
      type: 'SHOW_ALL'
    })
  }

  var style = {
    container: {
      width: '12%',
      left: '0%',
      height: '26%',
      padding: '2%',
      display: 'inline-block',
      verticalAlign: 'top',
      background: 'rgb(210, 210, 210)',
      borderRadius: '8px',
      border: 'solid 5px rgb(210, 210, 210)',
    },
    button: {
      borderRadius: '8px',
      border: 'none',
      height: '80%',
      width: '50%',
      fontSize: '110%',
      cursor: 'pointer'
    }
  }

  return hx`
  <div style=${style.container}>
    <span>arrow</span>
    <button style=${style.button} className='button' onclick=${onclick}>back</button>
  </div>`
}