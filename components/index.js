var hx = require('hxdx').hx
var overview = require('./overview')
var detail = require('./detail')

module.exports = function (state) {
  var style = {
    container: {
      width: '50%',
      marginLeft: '25%',
      marginRight: '25%',
      textAlign: 'center'
    },
    logo: {
      width: '350px',
      marginBottom: '5%',
      marginTop: '5%'
    }
  }

  var logo = hx`<img style=${style.logo} src='./assets/images/logo.svg'></img>`

  if (state.selection) {
    return hx`
    <div style=${style.container}>
    ${logo}
    ${detail(state.selection)}
    </div>
    `
  } else {
    return hx`
    <div style=${style.container}>
    ${logo}
    ${overview(state.binders)}
    </div>
    `
  }
}