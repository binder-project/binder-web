var hx = require('hxdx').hx
var assign = require('object-assign')

module.exports = function (state) {
  var style = {
    container: {
      width: '12%',
      left: '0%',
      height: '82%',
      padding: '2%',
      display: 'inline-block',
      verticalAlign: 'top',
      background: 'rgb(210, 210, 210)',
      borderRadius: '8px',
      border: 'solid 5px rgb(210, 210, 210)',
      position: 'relative',
      textAlign: 'center'
    },
    circle: {
      position: 'absolute',
      display: 'inline',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      backgroundColor: 'white',
      border: 'solid 7px white',
      zIndex: '1000',
      transition: 'all 1.0s',
      marginLeft: '8px'
    },
    progress: {
      marginLeft: '30px',
      position: 'absolute',
      display: 'inline-block',
      top: '5%',
      border: 'solid 6px white',
      width: '0px',
      transition: 'all 0.7s'
    },
    label: {
      position: 'absolute',
      right: '53%'
    }
  }

  console.log(state.entry)

  function height () {
    if (state.entry.stage === 'building') return '5%'
    if (state.entry.stage === 'loading') return '38.5%'
    if (state.entry.stage === 'completed') return '72%'
  }

  function color1 () {
    if (state.entry.stage === 'failed') return 'rgb(208,102,129)'
    else return 'rgb(243,162,83)'
  }

  function color2 () {
    if (state.entry.stage === 'loading' || state.entry.stage === 'completed' ) return 'rgb(87, 154, 203)'
    else return 'white'
  }

  function color3 () {
    if (state.entry.stage === 'completed' ) return 'rgb(91,186,71)'
    else return 'white'
  }

  var circle1 = assign({}, style.circle, {top: '5%', border: 'solid 7px ' + color1()})
  var circle2 = assign({}, style.circle, {top: '38.5%', border: 'solid 7px ' + color2()})
  var circle3 = assign({}, style.circle, {top: '72%', border: 'solid 7px ' + color3()})
  var label1 = assign({}, style.label, {top: '9%'})
  var label2 = assign({}, style.label, {top: '42.5%'})
  var label3 = assign({}, style.label, {top: '76%'})
  var progress = assign({}, style.progress, {height: height()})

  return hx`
  <div style=${style.container}>
    <hr style=${progress}>
    <span style=${label1}>submitted</span><div id='circle-submitted' style=${circle1}></div>
    <span style=${label2}>building</span><div id='circle-building' style=${circle2}></div>
    <span style=${label3}>completed</span><div id='circle-completed' style=${circle3}></div>
  </div>`
}