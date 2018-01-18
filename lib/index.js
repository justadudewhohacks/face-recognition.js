let fr;
if (process.env.BINDINGS_DEBUG) {
  fr = require('../build/Debug/facerec')
} else {
  fr = require('../build/Release/facerec')
}

const promisify = require('./promisify')
fr = promisify(fr)

const models = require('face-recognition-models')

fr.FaceDetector = require('./src/FaceDetector')(fr, models.faceDetectionModel, models.faceLandmarks68Model)
fr.AsyncFaceDetector = require('./src/AsyncFaceDetector')(fr, models.faceDetectionModel, models.faceLandmarks68Model)
fr.FaceRecognizer = require('./src/FaceRecognizer')(fr, models.faceRecognitionModel)
fr.FaceLandmark5Predictor = require('./src/FaceLandmarkPredictor')(fr, models.faceLandmarks5Model)
fr.FaceLandmark68Predictor = require('./src/FaceLandmarkPredictor')(fr, models.faceLandmarks68Model)

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

fr.withCv = function(cv) {
  return Object.assign({}, fr, require('./src/withCv')(fr, cv))
}

module.exports = fr