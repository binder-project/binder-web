var hx = require('hxdx').hx
var assign = require('object-assign')
var theme = require('../../theme')

module.exports = function (entry) {
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
      right: '53%',
      color: 'rgb(50,50,50)'
    }
  }


  // if phase is fetching -> line is at the top
  // if phase is building -> line is at the middle
  // if phase is finished -> line is at the bottom

  // if phase is fetching -> first circle is green, second and third are white
  // if phase is building -> first and second circle are green, third is white
  // if phase is finished -> all circles are green
  // EXCEPT
  // for all of the above, if status is failed, show red instead of green

  // entry.status = 'building' | 'loading' | 'pending' | completed' | 'failed'
  // entry.phase = 'fetching' | 'building' | 'finished'

  function height () {
    if (entry.phase === 'fetching') return '5%'
    if (entry.phase === 'building') return '38.5%'
    if (entry.phase === 'finished') return '72%'
  }

  function color1 () {
    if ((entry.phase === 'fetching' || entry.phase === 'building') && entry.status !== 'failed') return theme.ORANGE
    if (entry.phase === 'finished' && entry.status !== 'failed') return theme.GREEN
    if (entry.status === 'failed') return theme.RED
    else return theme.WHITE
  }

  function color2 () {
    if (entry.phase === 'fetching') return theme.WHITE
    if (entry.phase === 'building' && entry.status !== 'failed') return theme.ORANGE
    if (entry.phase === 'finished' && entry.status !== 'failed') return theme.GREEN
    if ((entry.phase === 'building' || entry.phase === 'finished') && entry.status === 'failed') return theme.RED
    else return theme.WHITE
  }

  function color3 () {
    if (entry.phase === 'fetching') return theme.WHITE
    if (entry.phase === 'building') return theme.WHITE
    if (entry.phase === 'finished' && entry.status !== 'failed') return theme.GREEN
    if (entry.phase === 'finished' && entry.status === 'failed') return theme.RED
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
