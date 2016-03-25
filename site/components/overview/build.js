var hx = require('hxdx').hx
var dx = require('hxdx').dx
var actions = require('../../reducers/actions')

module.exports = function () { 
  function submit () {
    var value = document.querySelector('#submission').value
    actions.submitBuild(value)(dx)
  }

  function onclick () {
    submit()
  }

  function onkeydown (e) {
    if (e.keyCode == 13) submit()
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
      fontSize: '180%',
      color: 'rgb(50,50,50)'
    },
    input: {
      background: 'rgb(255, 255, 255)',
      borderRadius: '8px',
      border: 'none',
      height: '40%',
      width: '70%',
      marginRight: '5%',
      paddingLeft: '12px',
      fontSize: '16px',
      fontFamily: 'ClearSans-Light',
      color: 'rgb(50,50,50)'
    },
    button: {
      background: 'rgb(255, 255, 255)',
      borderRadius: '8px',
      border: 'none',
      height: '40%',
      width: '20%',
      fontSize: '110%',
      cursor: 'pointer'
    }
  }

  return hx`<div style=${styles.container}>
    <div style=${styles.message}>build a repository</div>
    <input type='text' id='submission' style=${styles.input} onkeydown=${onkeydown}'>
    <button onclick=${onclick} className='button' style=${styles.button}>submit</button>
  </div>`
}
