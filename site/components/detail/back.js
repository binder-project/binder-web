var hx = require('hxdx').hx
var dx = require('hxdx').dx
var href = require('sheet-router/href')
var router = require('../../router')
var actions = require('../../reducers/actions')

module.exports = function () {
  function onclick () {
    href(function (link) {router(link)})
  }

  var style = {
    container: {
      width: '15%',
      textAlign: 'right',
      left: '0%',
      height: '26%',
      paddingTop: '1.5%',
      paddingBottom: '2.5%',
      paddingLeft: '0%',
      paddingRight: '1%',
      display: 'inline-block',
      verticalAlign: 'top',
      background: 'rgb(225, 226, 227)',
      borderRadius: '8px',
      border: 'solid 5px rgb(225, 226, 227)'
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
    <a href='/'><button style=${style.button} className='button' onclick=${onclick}>go back</button></a>
  </div>`
}
