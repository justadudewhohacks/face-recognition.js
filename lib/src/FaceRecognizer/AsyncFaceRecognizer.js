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

      const promises = flatten(
        faces.map(
          f => getJitteredFaces(f, numJitters).map(
            () => getNet().computeFaceDescriptorAsync(f)
          )
        )
      )

      return Promise.all(promises)
        .then(descriptors => addFaceDescriptors(descriptors, className))
    }

    /* get the prediction distances for all classes */
    function predict(face) {
      return getNet().computeFaceDescriptorAsync(face)
        .then(inputDescriptor =>
          getDescriptorsByClass().map(ds => ({
            className: ds.className,
            distance: computeMeanDistance(ds.faceDescriptors, inputDescriptor)
          }))
        )
    }

    /* returns the class name of the prediction with lowest distance */
    function predictBest(face, unknownThreshold = 0) {
      return predict(face)
        .then(predictions => getBestPrediction(predictions, unknownThreshold))
    }

    return Object.assign({}, base.externals, {
      addFaces,
      predict,
      predictBest
    })
  }
}