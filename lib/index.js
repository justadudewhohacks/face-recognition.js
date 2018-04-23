const isElectronWebpack =
  // assume module required by webpack if no system path inv envs
  !process.env.path
  // detect if electron https://github.com/electron/electron/issues/2288
  && global.window && global.window.process && global.window.process.type
  && global.navigator && ((global.navigator.userAgent || '').toLowerCase().indexOf(' electron/') > -1)

let fr = isElectronWebpack ? require('../build/Release/facerec.node') : require('./fr')

const promisify = require('./promisify')
fr = promisify(fr)

// allow to require with absolute filepaths to models with electron + webpack
fr.withSources = function(models) {
  fr.models = models
  return require('./src/withSources')(fr, models)
}

fr.withCv = function(cv) {
  return require('./src/withCv')(fr, cv)
}

if (!isElectronWebpack) {
  fr.withSources(require('face-recognition-models'))
}

// on windows there is currently a bug, which causes the
// process to not exit properly, when fr.FaceDetector
// is used, thus we have to kill this process on exit
fr.winKillProcessOnExit = function() {
  if (process.platform === 'win32') {
    process.on('exit', (code) => {
      if (code === 0) {
        process.kill(process.pid)
      }
    })

    process.on('SIGINT', () => {
      process.kill(process.pid)
    })
  }
}

module.exports = fr