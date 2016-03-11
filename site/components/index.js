var hx = require('hxdx').hx
var overview = require('./overview')
var detail = require('./detail')

module.exports = function (state) {
  var style = {
    overview: {
      width: '50%',
      marginLeft: '25%',
      marginRight: '25%'
    },
    detail: {
      width: '80%',
      marginLeft: '10%',
      marginRight: '10%'
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
    <img style=${style.logo} src='./assets/images/logo.svg'></img>
  </div>`

  if (state.selection.entry) {
    return hx`
    <div>
      ${logo}
      <div style=${style.detail}>
        ${detail(state.selection)}
      </div>
    </div>
    `
  } else {
    return hx`
    <div>
      ${logo}
      <div style=${style.overview}>
        ${overview(state.collection)}
      </div>
    </div>
    `
  }
}