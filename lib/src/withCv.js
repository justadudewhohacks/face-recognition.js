module.exports = function (fr, cv) {
  function CvImage(mat) {
    if (!(mat instanceof cv.Mat)) {
      throw new Error('CvImage - expected argument to a cv.Mat')
    }

    return new fr.CvImageWrap(
      mat.rows,
      mat.cols,
      mat.step,
      mat.elemSize,
      mat.getData()
    )
  }

  function toCvRect(dlibRect) {
    if (!(dlibRect instanceof fr.Rect)) {
      throw new Error('toCvRect - expected argument to a fr.Rect')
    }

    const { left, right, bottom, top } = dlibRect
    return new cv.Rect(
      left,
      top,
      right - left,
      bottom - top
    )
  }

  return ({
    CvImage,
    toCvRect
  })
}