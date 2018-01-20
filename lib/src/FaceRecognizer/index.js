const {
  serializeDescriptors,
  toDescriptorState,
  makeLoadDescriptors,
  makeComputeMeanDistance,
  makeGetJitteredFaces,
  makeAddFaceDescriptors
} = require('./commons')

module.exports = function (fr, faceRecognitionModel) {
  const loadDescriptors = makeLoadDescriptors(fr)
  const computeMeanDistance = makeComputeMeanDistance(fr)
  const getJitteredFaces = makeGetJitteredFaces(fr)

  function FaceRecognizerBase(fr, faceRecognitionModel) {
    const net = new fr.FaceRecognizerNet(faceRecognitionModel)
    let descriptorsByClass = []

    function addFaceDescriptors(faceDescriptors, className) {
      return makeAddFaceDescriptors(descriptorsByClass)(faceDescriptors, className)
    }

    function serialize() {
      return serializeDescriptors(descriptorsByClass)
    }

    function load(rawDescriptors) {
      descriptorsByClass = loadDescriptors(rawDescriptors)
    }

    /* reset, e.g. clear the descriptors */
    function clear() {
      descriptorsByClass = []
    }

    /* return the number of descriptors for the corresponding classes */
    function getDescriptorState() {
      return toDescriptorState(descriptorsByClass)
    }

    return({
      internals: {
        getNet: () => net,
        getDescriptorsByClass: () => descriptorsByClass,
        addFaceDescriptors,
        computeMeanDistance,
        getJitteredFaces
      },
      externals: {
        serialize,
        load,
        clear,
        getDescriptorState
      }
    })
  }

  return ({
    FaceRecognizer: require('./FaceRecognizer')(() => FaceRecognizerBase(fr, faceRecognitionModel)),
    AsyncFaceRecognizer: require('./AsyncFaceRecognizer')(() => FaceRecognizerBase(fr, faceRecognitionModel))
  })
}