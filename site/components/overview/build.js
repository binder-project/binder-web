var url = require('url')
var hx = require('hxdx').hx
var dx = require('hxdx').dx
var actions = require('../../reducers/actions')
var href = require('sheet-router/href')
var router = require('../../router')
var request = require('browser-request')
var css = require('dom-css')
var theme = require('../../theme')

function validUrl (value) {
  var parsed = url.parse(value)
  return parsed.hostname === 'github.com'
}

module.exports = function () {
  function submit () {
    var input = document.querySelector('#submission')
    var link = document.querySelector('#submission-link')
    var value = input.value
    if (validUrl(value)) {
      // github repos are not case-sensitive
      value = value.toLowerCase()
      actions.submitBuild(value)(dx)
      link.href = '/status/' + value.replace('https://github.com/', '')
      link.onclick = function () {
        href(function (link) {router(link)})
      }
      link.click()
    } else {
      input.value = ''
      css(input, {
        boxShadow: '0 0 0 2px ' + theme.RED
      })
    }
  }

  function focus () {
    css(document.querySelector('#submission'), {
      boxShadow: '0 0 0 2px ' + theme.ORANGE
    })
  }

  function blur () {
    css(document.querySelector('#submission'), {
      boxShadow: '0 0 0 0px rgb(200,200,200)'
    })
  }

  function onkeydown (e) {
    focus()
    if (e.keyCode == 13) submit()
  }

  var styles = {
    container: {
      width: '90%',
      background: 'rgb(225, 226, 227)',
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
    <div style=${styles.message}>Build a repository</div>
    <input type='text' id='submission' style=${styles.input} onclick=${focus} onfocus=${focus} onblur=${blur} onkeydown=${onkeydown}'>
    <a id='submission-link' style='display: none'></a>
    <button onclick=${submit} className='button-orange' style=${styles.button}>submit</button>
  </div>`
}
