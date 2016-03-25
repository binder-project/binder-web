var hx = require('hxdx').hx
var overview = require('./overview')
var detail = require('./detail')

module.exports = function (state) {
  var width = window.innerWidth

  var style = {
    overview: {
      width: '50%',
      marginLeft: '25%',
      marginRight: '25%',
      marginBottom: '75px'
    },
    detail: {
      width: (width < 1200) ? '90%' : '80%',
      marginLeft: (width < 1200) ? '5%' : '10%',
      marginRight: (width < 1200) ? '5%' : '10%'
    },
    header: {
      width: '80%',
      marginLeft: '10%',
      marginRight: '10%',
      textAlign: 'center',
      marginBottom: '3%',
      marginTop: '3%'
    },
    logo: {
      width: '350px'
    }
  }

  var logo = hx`
  <div style=${style.header}>
    <img style=${style.logo} src='/assets/images/logo.svg'></img>
  </div>`

  console.log('selection: ' + state.selection)
  if (state.selection) {
    return hx`
    <div>
      ${logo}
      <div style=${style.detail}>
        ${detail()}
      </div>
    </div>
    `
  } else {
    return hx`
    <div>
      ${logo}
      <div style=${style.overview}>
        ${overview()}
      </div>
    </div>
    `
  }
}
