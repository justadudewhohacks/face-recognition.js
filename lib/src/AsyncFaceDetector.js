module.exports = function (fr, faceDetectionModel, faceLandmarks68Model) {
  return function() {
    const net = new fr.FaceDetectorNet(faceDetectionModel)
    const face68LandmarkPredictor = new fr.ShapePredictor(faceLandmarks68Model)

    /* find face rectangles */
    function locateFaces(img) {
      return net.detectAsync(img)
    }

    /* extract the faces from an image for given face rectangles */
    function getFacesFromLocations(img, rects, faceSize = 150) {
      return Promise.all(
        rects.map(rect => face68LandmarkPredictor.predictAsync(img, rect))
      )
        .then(shapes68 => fr.extractImageChips(img, fr.getFaceChipDetails(shapes68, faceSize)))
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