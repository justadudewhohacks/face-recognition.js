module.exports = function(fr, models) {
  Object.assign(fr, require('./FaceDetector')(fr, models.faceDetectionModel, models.faceLandmarks5Model, models.faceLandmarks68Model))
  Object.assign(fr, require('./FaceRecognizer')(fr, models.faceRecognitionModel))
  fr.FaceLandmark5Predictor = require('./FaceLandmarkPredictor')(fr, models.faceLandmarks5Model)
  fr.FaceLandmark68Predictor = require('./FaceLandmarkPredictor')(fr, models.faceLandmarks68Model)
}