let fr;
if (process.env.BINDINGS_DEBUG) {
  fr = require('../build/Debug/facerec')
} else {
  fr = require('../build/Release/facerec')
}

const models = require('face-recognition-models')

fr.FaceDetector = require('./src/FaceDetector')(fr, models.faceDetectionModel, models.faceLandmarks68Model)
fr.FaceRecognizer = require('./src/FaceRecognizer')(fr, models.faceRecognitionModel)
fr.FaceLandmark5Predictor = require('./src/FaceLandmarkPredictor')(fr, models.faceLandmarks5Model)
fr.FaceLandmark68Predictor = require('./src/FaceLandmarkPredictor')(fr, models.faceLandmarks68Model)
fr.CvImage = require('./src/CvImage')(fr)

module.exports = fr