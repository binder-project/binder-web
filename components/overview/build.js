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
        deployed: 10
      }
    })
  }

  return hx`<div ref=${function () {console.log('foo')}}>
    <div>build a repo</div>
    <input id='submission'>
    <button onclick=${onclick}>submit</button>
  </div>`
}