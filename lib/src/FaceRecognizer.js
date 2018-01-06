module.exports = function (fr, faceRecognitionModel) {
  return function() {
    const net = new fr.FaceRecognizerNet(faceRecognitionModel)
    const descriptorsByClass = []

    function round(num, precision = 2) {
      const f = Math.pow(10, precision)
      return Math.round(num * f) / f
    }

    function flatten(arr) {
      return arr.reduce((res, el) => res.concat(el), [])
    }

    /* compute the mean value of the euclidean distances of the input descriptor */
    /* to each of the face descriptors, which the recognizer has been trained on, */
    /* this is used as the metric to judge how similar the faces are to the training data*/
    function computeMeanDistance(descriptors, inputDescriptor) {
      return round(
        descriptors
          .map(d => fr.distance(d, inputDescriptor))
          .reduce((d1, d2) => d1 + d2, 0)
            / descriptors.length || 1,
        )
    }

    /* make sligthly rotated, scaled and mirrored variants of the input image */
    /* can be useful to increase the training set in order to get better results */
    /* but also training time increases with numJitters  */
    function getJitteredFaces(face, numJitters) {
      return [face].concat(!numJitters ? [] : fr.jitterImage(face, numJitters))
    }

    /* reset, e.g. clear the descriptors */
    function clear() {
      descriptors = []
    }

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

    /* get the prediction distances for all classes */
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

    /* returns the class name of the prediction with lowest distance */
    function predictBest(face) {
      return predict(face)
        .sort((p1, p2) => p1.distance - p2.distance)[0]
    }

    /* return the number of descriptors for the corresponding classes */
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
}