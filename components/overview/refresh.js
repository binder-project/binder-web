var hx = require('hxdx').hx
var dx = require('hxdx').dx

module.exports = function (state) { 
  function fetch () {
    dx({type: 'POPULATE'})
  }

  var style = {
    container: {
      width: '90%',
      height: '50px',
      textAlign: 'left',
      padding: '1%'
    }
  }

  return hx`
  <div style=${style.container}>
    <button onclick=${fetch}>refresh</button>
  </div>`
}