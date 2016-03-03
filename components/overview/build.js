var hx = require('hxdx').hx
var dx = require('hxdx').dx

module.exports = function (state) { 
  function onclick () {
    var value = document.querySelector('#submission').value
    dx({
      type: 'SHOW_DETAIL', 
      props: {
        name: value, 
        stage: 'building', 
        deployed: 10,
        visible: true
      }
    })
  }

  var styles = {
    container: {
      width: '90%',
      background: 'rgb(210, 210, 210)',
      borderRadius: '8px',
      height: '100px',
      textAlign: 'left',
      padding: '5%',
      marginBottom: '5%'
    },
    message: {
      marginBottom: '3%',
      fontSize: '180%'
    },
    input: {
      background: 'rgb(254, 254, 254)',
      borderRadius: '8px',
      border: 'none',
      height: '40%',
      width: '70%',
      marginRight: '5%',
      paddingLeft: '12px',
      fontSize: '110%'
    },
    button: {
      background: 'rgb(254, 254, 254)',
      borderRadius: '8px',
      border: 'none',
      height: '40%',
      width: '20%',
      fontSize: '110%'
    }
  }

  return hx`<div style=${styles.container}>
    <div style=${styles.message}>build a repository</div>
    <input id='submission' onchange=${onclick} style=${styles.input}'>
    <button onclick=${onclick} style=${styles.button}>submit</button>
  </div>`
}