module.exports = function (fr, faceDetectionModel, faceLandmarks68Model) {
  return function() {
    const net = new fr.FaceDetectorNet(faceDetectionModel)
    const face68LandmarkPredictor = new fr.ShapePredictor(faceLandmarks68Model)


    function predictShapes68(img, rect) {
      return face68LandmarkPredictor.predict(img, rect)
    }

    /* find face rectangles */
    function locateFaces(img) {
      return net.detect(img)
    }

    /* extract the faces from an image for given face rectangles */
    function getFacesFromLocations(img, rects, faceSize = 150) {
      const shapes68 = rects.map(rect => face68LandmarkPredictor.predict(img, rect))
      return fr.extractImageChips(img, fr.getFaceChipDetails(shapes68, faceSize))
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