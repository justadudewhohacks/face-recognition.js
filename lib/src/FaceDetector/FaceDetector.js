module.exports = function (fr, faceDetectionModel, faceLandmarks5Model, faceLandmarks68Model) {
  return function(useFaceLandmarks68Model = false) {
    const net = new fr.FaceDetectorNet(faceDetectionModel)
    const faceLandmarkPredictor = new fr.ShapePredictor(useFaceLandmarks68Model ? faceLandmarks68Model : faceLandmarks5Model)

    /* find face rectangles */
    function locateFaces(img) {
      return net.detect(img)
    }

    /* extract the faces from an image for given face rectangles */
    function getFacesFromLocations(img, rects, faceSize = 150) {
      const shapes = rects.map(rect => faceLandmarkPredictor.predict(img, rect))
      return fr.extractImageChips(img, fr.getFaceChipDetails(shapes, faceSize))
    }

    /* extract all faces from an image */
    function detectFaces(img, faceSize = 150) {
      return getFacesFromLocations(img, locateFaces(img).map(mmodRect => mmodRect.rect), faceSize)
    }

    return ({
      locateFaces,
      getFacesFromLocations,
      detectFaces
    })
  }
}