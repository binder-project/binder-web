var hx = require('hxdx').hx
var dx = require('hxdx').dx
var css = require('dom-css')

module.exports = function (state) {
  var style = {
    container: {
      width: '12%',
      height: '82%',
      padding: '2%',
      display: 'inline-block',
      verticalAlign: 'top',
      background: 'rgb(210, 210, 210)',
      borderRadius: '8px',
      border: 'solid 5px rgb(210, 210, 210)',
    },
    badgeContainer: {
      width: '80%',
      background: 'white',
      fontSize: '65%',
      padding: '10px',
      display: 'none',
      borderRadius: '5px',
      wordWrap: 'break-word',
      marginBottom: '5px'
    },
    badge: {
      width: '110px',
      display: 'inline-block',
      marginLeft: '0px',
      marginTop: '10px'
    }
  }

  function md () {
    return '[![Binder](http://mybinder.org/badge.svg)](' + link() + ')'
  }

  function rst () {
    return '.. image:: http://mybinder.org/badge.svg :target: ' + link()
  }

  function link () {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port
    return baseURL + '/repo/' + state['display-name']
  }

  function showmd () {
    css(document.querySelector('#badge-container'), {display: 'inline-block'})
    document.querySelector('#md-copy').className = 'btn btn-copy btn-copy-left btn-copy-active'
    document.querySelector('#rst-copy').className = 'btn btn-copy btn-copy-left'
    document.querySelector('#badge-snippet').innerHTML = md()
  }

  function showrst () {
    css(document.querySelector('#badge-container'), {display: 'inline-block'})
    document.querySelector('#rst-copy').className = 'btn btn-copy btn-copy-left btn-copy-active'
    document.querySelector('#md-copy').className = 'btn btn-copy btn-copy-left'
    document.querySelector('#badge-snippet').innerHTML = rst()
  }

  return hx`
  <div style=${style.container}>
    <div>grab badge code in your format</div>
    <div style='margin-top: 10px; margin-bottom: 10px'>
      <span id='md-copy' onclick=${showmd} className='btn btn-copy btn-copy-left'>.md</span>
      <span id='rst-copy' onclick=${showrst} className='btn btn-copy btn-copy-right'>.rst</span>
    </div>
    <div id='badge-container' style=${style.badgeContainer}>
      <span id='badge-snippet'></span>
    </div>
    <div>paste into your README to get</div>
    <a href=${link()}>
      <img style=${style.badge} src="/assets/images/badge.svg"></img>
    </a>
  </div>`
}
