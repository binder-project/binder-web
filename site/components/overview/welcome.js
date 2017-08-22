var hx = require('hxdx').hx

module.exports = function () {
  var styles = {
    container: {
      marginBottom: '50px'
    },
    big: {
      fontFamily: 'ClearSans-Thin',
      fontSize: '275%',
      color: 'rgb(70,70,70)',
      textAlign: 'center'
    },
    medium: {
      fontFamily: 'ClearSans-Thin',
      fontSize: '125%',
      color: 'rgb(40,40,40)',
      textAlign: 'center'
    },
    attention: {
      fontFamily: 'ClearSans-Thin',
      fontSize: '170%',
      color: 'rgb(228, 110, 46)',
      textAlign: 'center'
    }
  }
  return hx`
  <div style=${styles.container}>
    <h1 style=${styles.big}>Turn a GitHub repo into a collection of interactive notebooks</h1>
    <h2 style=${styles.attention}>Binder is upgrading and will be better than ever soon.<br />In the meantime, it may be a bit unstable.<br />Try the beta at <a href="http://beta.mybinder.org">beta.mybinder.org</a>!</h2>
    <h2 style=${styles.medium}>Have a repository full of Jupyter notebooks? With Binder, you can add a badge that opens those notebooks in an executable environment, making your code immediately reproducible by anyone, anywhere.</h2>
    <h2 style=${styles.medium}>100% free and <a className='welcome-link' href='https://github.com/binder-project'>open source</a>. Browse <a className='welcome-link' href='https://github.com/binder-project?q=example'>examples</a>. Read the <a className='welcome-link' href='http://docs.mybinder.org/faq'>FAQ</a>.</h2>
  </div>
  `
}
