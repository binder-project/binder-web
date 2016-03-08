var hx = require('hxdx').hx
var binder = require('./binder')

module.exports = function (collection) {
  var style = {
    list: {
      width: '93%',
      borderRadius: '8px',
      border: 'solid 5px rgb(210, 210, 210)',
      height: '100%',
      textAlign: 'left',
      padding: '3%',
      paddingBottom: '2%'
    }
  }

  if (!collection.loading) {
    return hx`
    <div style=${style.list}>
    ${collection.entries.map(function (entry) {
      return binder(entry)
    })}
    </div>`
  } else {
    return hx`
    <div style=${style.list}>loading</div>`
  } 
}