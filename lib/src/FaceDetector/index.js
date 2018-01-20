module.exports = function (fr, faceDetectionModel, faceLandmarks68Model) {
  return ({
    FaceDetector: require('./FaceDetector')(fr, faceDetectionModel, faceLandmarks68Model),
    AsyncFaceDetector: require('./AsyncFaceDetector')(fr, faceDetectionModel, faceLandmarks68Model)
  })
}