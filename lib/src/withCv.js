module.exports = function (fr, cv) {
  function CvImage(mat) {
    if (!(mat instanceof cv.Mat)) {
      throw new Error('CvImage - expected argument to be a cv.Mat')
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
      throw new Error('toCvRect - expected argument to be a fr.Rect')
    }

    const { left, right, bottom, top } = dlibRect
    return new cv.Rect(
      left,
      top,
      right - left,
      bottom - top
    )
  }

  function fromCvRect(cvRect) {
    if (!(cvRect instanceof cv.Rect)) {
      throw new Error('fromCvRect - expected argument to be a cv.Rect')
    }

    const { x, y, width, height } = cvRect
    return new fr.Rect(
      x,
      y,
      width + x,
      height + y
    )
  }

  const extendedFr = Object.assign(fr, {
    CvImage,
    toCvRect,
    fromCvRect
  })

  return extendedFr
}