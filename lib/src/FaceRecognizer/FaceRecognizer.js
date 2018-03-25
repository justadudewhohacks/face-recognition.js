const {
  flatten,
  serializeDescriptors,
  toDescriptorState,
  makeLoadDescriptors,
  makeComputeMeanDistance,
  makeGetJitteredFaces,
  makeAddFaceDescriptors,
  getBestPrediction
} = require('./commons')

module.exports = function (getBase) {
  return function() {
    const base = getBase()
    const {
      getNet,
      getDescriptorsByClass,
      addFaceDescriptors,
      computeMeanDistance,
      getJitteredFaces
    } = base.internals

    /* compute the face descriptors for all faces of the given class, which are used for prediction */
    /* this function is used to "train" the recognizer and has to be performed for all persons faces, */
    /* which you want to recognize before running prediction */
    function addFaces(faces, className, numJitters = 0) {
      if (!faces || !faces.length) {
        throw new Error('train - expected an array containing atleast one face image')
      }

      if (!className) {
        throw new Error('train - expected a class name')
      }

      const faceDescriptors = flatten(
        faces.map(f => getJitteredFaces(f, numJitters).map(jf => getNet().computeFaceDescriptor(jf)))
      )

      addFaceDescriptors(faceDescriptors, className)
    }

    function getFaceDescriptors(face) {
      return getNet().computeFaceDescriptor(face).getData();
    }

    /* get the prediction distances for all classes */
    function predict(face) {
      const inputDescriptor = getNet().computeFaceDescriptor(face)
      return getDescriptorsByClass().map(ds => ({
        className: ds.className,
        distance: computeMeanDistance(ds.faceDescriptors, inputDescriptor)
      }))
    }

    /* returns the class name of the prediction with lowest distance */
    function predictBest(face, unknownThreshold = 0) {
      return getBestPrediction(predict(face), unknownThreshold)
    }

    return Object.assign({}, base.externals, {
      addFaces,
      getFaceDescriptors,
      predict,
      predictBest
    })
  }
}