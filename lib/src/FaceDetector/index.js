module.exports = function (fr, faceDetectionModel, faceLandmarks5Model, faceLandmarks68Model) {
  return ({
    FaceDetector: require('./FaceDetector')(fr, faceDetectionModel, faceLandmarks5Model, faceLandmarks68Model),
    AsyncFaceDetector: require('./AsyncFaceDetector')(fr, faceDetectionModel, faceLandmarks5Model, faceLandmarks68Model)
  })
}