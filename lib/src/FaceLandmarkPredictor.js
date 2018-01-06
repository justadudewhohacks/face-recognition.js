module.exports = function (fr, faceLandmarksModel) {
  return function() {
    return new fr.ShapePredictor(faceLandmarksModel)
  }
}