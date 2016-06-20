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
      textAlign: 'left'
    },
    small: {
      fontFamily: 'ClearSans-Thin',
      fontSize: '125%',
      color: 'rgb(40,40,40)',
      textAlign: 'center'
    }
  }

  return hx`
  <div>
    <h1 style=${styles.big}>How it works</h1>
    <div>
      <h2 style=${styles.medium}>Tell us a GitHub repository that contains Jupyter notebooks. If it includes an index.ipynb file, that’s where it’ll start. Any extra files or folders will be included. See an example.</h2>
    </div>
    <div>
      <h2 style=${styles.medium}>We’ll search in order for the following dependency files: Dockerfile, requirements.txt (for Python), environment.yml (for conda projects) and use it to build an image. See examples for different kinds of builds.</h2>
    </div>
    <div style='margin-bottom: 50px'>
      <h2 style=${styles.medium}>When your build finishes you’ll get a link that you can embed with a badge in your repo. Anyone who clicks it will launch your environment right in the browser!</h2>
    </div>
    <div style='margin-bottom: 50px'>
      <h1 style=${styles.big}>questions? join the <a className='welcome-link welcome-link-pink' href='https://gitter.im/binder-project/binder'>chat</a>, see the <a className='welcome-link welcome-link-orange' href='https://github.com/binder-project'>code</a></h1>
    </div>
    <div>
      <h1 style=${styles.small}>check the system <a className='welcome-link' href='/status'>status</a></h1>
    </div>
  </div>
  `
}