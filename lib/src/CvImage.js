module.exports = function (fr) {
  return function(mat) {
    return new fr.CvImageWrap(
      mat.rows,
      mat.cols,
      mat.step,
      mat.elemSize,
      mat.getData()
    )
  }
}