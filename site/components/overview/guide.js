var hx = require('hxdx').hx
var assign = require('object-assign')

var theme = require('../../theme.js')

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
      textAlign: 'left',
      marginTop: '0px'
    },
    small: {
      fontFamily: 'ClearSans-Thin',
      fontSize: '125%',
      color: 'rgb(40,40,40)',
      textAlign: 'center'
    },
    description: {
      float: 'left',
      width: '90%'
    },
    step: {
      display: 'inline-block',
      marginTop: '10px',
      marginBottom: '10px'
    },
    label: {
      float: 'left',
      width: '10%',
      marginTop: '15px'
    },
    number: {
      width: '30px',
      height: '30px',
      paddingTop: '5px',
      paddingBottom: '5px',
      paddingLeft: '10px',
      paddingRight: '10px',
      borderRadius: '50%',
      fontFamily: 'ClearSans-Medium'
    },
    questions: {
      display: 'inline-block', 
      marginTop: '0px', 
      marginBottom: '5px'
    },
    orange: {
      color: theme.ORANGE,
      border: 'solid 5px ' + theme.ORANGE
    },
    red: {
      color: theme.RED,
      border: 'solid 5px ' + theme.RED
    },
    blue: {
      color: theme.BLUE,
      border: 'solid 5px ' + theme.BLUE
    }
  }

  return hx`
  <div>
    <h1 style=${styles.big}>How it works</h1>
    <div style=${styles.step}>
      <div style=${styles.label}><span style=${assign(styles.orange, styles.number)}>1</span></div>
      <div style=${styles.description}>
        <h2 style=${styles.medium}>In the field above enter a GitHub repository that contains Jupyter notebooks. If it includes an index.ipynb file, that’s where it’ll start. Any extra files or folders will be included (e.g. data). See an example.</h2>
      </div>
    </div>
    <div style=${styles.step}>
      <div style=${styles.label}><span style=${assign(styles.red, styles.number)}>2</span></div>
      <div style=${styles.description}>
        <h2 style=${styles.medium}>We’ll search your repository for dependency files, in the following preference order: Dockerfile, requirements.txt (for Python), environment.yml (for Conda). We'll use the one we find to build an image. See examples for different kinds of builds.</h2>
      </div>
    </div>
    <div style=${styles.step}>
      <div style=${styles.label}><span style=${assign(styles.blue, styles.number)}>3</span></div>
      <div style=${styles.description}>
        <h2 style=${styles.medium}>When your build finishes you’ll get a link that you can embed with a badge in your repository. Anyone who clicks the link will launch your environment immediately in the browser!</h2>
      </div>
    </div>
    <div style=${styles.questions}>
      <h1 style=${styles.big}>questions? join the <a className='welcome-link welcome-link-pink' href='https://gitter.im/binder-project/binder'>chat</a>, see the <a className='welcome-link welcome-link-orange' href='https://github.com/binder-project'>code</a></h1>
    </div>
    <div>
      <h1 style=${styles.small}>check the system <a className='welcome-link' href='/status'>status</a></h1>
    </div>
  </div>
  `
}