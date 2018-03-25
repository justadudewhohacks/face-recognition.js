module.exports = function (fr, faceDetectionModel, faceLandmarks5Model, faceLandmarks68Model) {
  return function(useFaceLandmarks68Model = false) {
    const net = new fr.FaceDetectorNet(faceDetectionModel)
    const faceLandmarkPredictor = new fr.ShapePredictor(useFaceLandmarks68Model ? faceLandmarks68Model : faceLandmarks5Model)

    /* find face rectangles */
    function locateFaces(img) {
      return net.detectAsync(img)
    }

    /* extract the faces from an image for given face rectangles */
    function getFacesFromLocations(img, rects, faceSize = 150) {
      return Promise.all(
        rects.map(rect => faceLandmarkPredictor.predictAsync(img, rect))
      )
        .then(shapes => fr.extractImageChips(img, fr.getFaceChipDetails(shapes, faceSize)))
    }

    /* extract all faces from an image */
    function detectFaces(img, faceSize = 150) {
      return locateFaces(img)
        .then(rects => getFacesFromLocations(img, rects.map(mmodRect => mmodRect.rect), faceSize))
    }

    return ({
      locateFaces,
      getFacesFromLocations,
      detectFaces
    })
  }
}