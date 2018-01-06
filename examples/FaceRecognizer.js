const {
  fr,
  loadFaceRecognizerNet
} = require('./commons')

module.exports = function() {
  const net = loadFaceRecognizerNet()
  const descriptorsByClass = []

  function round(num, precision = 2) {
    const f = Math.pow(10, precision)
    return Math.round(num * f) / f
  }

  function computeMeanDistance(descriptors, inputDescriptor) {
    return round(
      descriptors
        .map(d => fr.distance(d, inputDescriptor))
        .reduce((d1, d2) => d1 + d2, 0)
          / descriptors.length || 1,
      )
  }

  function flatten(arr) {
    return arr.reduce((res, el) => res.concat(el), [])
  }

  function getJitteredFaces(face, numJitters) {
    return [face].concat(!numJitters ? [] : fr.jitterImage(face, numJitters))
  }

  function clear() {
    descriptors = []
  }

  function addFaces(faces, className, numJitters = 0) {
    if (!faces || !faces.length) {
      throw new Error('train - expected an array containing atleast one face image')
    }

    if (!className) {
      throw new Error('train - expected a class name')
    }

    const idx = descriptorsByClass.findIndex(d => d.className === className)
    const faceDescriptors = flatten(
      faces.map(f => getJitteredFaces(f, numJitters).map(jf => net.computeFaceDescriptor(jf)))
    )

    if (idx === -1) {
      descriptorsByClass.push({
        className,
        faceDescriptors
      })
      return
    }

    descriptorsByClass[idx].faceDescriptors = descriptorsByClass[idx].faceDescriptors.concat(faceDescriptors)
  }

  function predict(face) {
    if (descriptorsByClass.length < 2) {
      throw new Error('predict - expected FaceRecognizer to be trained with at least 2 different classes')
    }

    const inputDescriptor = net.computeFaceDescriptor(face)
    return descriptorsByClass.map(ds => ({
      className: ds.className,
      distance: computeMeanDistance(ds.faceDescriptors, inputDescriptor)
    }))
  }

  function predictBest(face) {
    return predict(face)
      .sort((p1, p2) => p1.distance - p2.distance)[0]
  }

  function getDescriptorState() {
    return descriptorsByClass.map(d => ({ className: d.className, numFaces: d.faceDescriptors.length }))
  }

  return ({
    clear,
    addFaces,
    predict,
    predictBest,
    getDescriptorState
  })
}