const descriptorSize = 128

function flatten(arr) {
  return arr.reduce((res, el) => res.concat(el), [])
}

function round(num, precision = 2) {
  const f = Math.pow(10, precision)
  return Math.round(num * f) / f
}

function checkDescriptors(rawDescriptors) {
  rawDescriptors.forEach((ds) => {
    if (!ds.className) {
      throw new Error('import - expected a class name for every group of descriptors')
    }
    if (!ds.faceDescriptors.every(d => d.length === descriptorSize)) {
      throw new Error(`import - expected every descriptor to have ${descriptorSize} entries`)
    }
  })
}

function serializeDescriptors(descriptorsByClass) {
  return descriptorsByClass.map(ds => ({
    className: ds.className,
    faceDescriptors: ds.faceDescriptors.map(d => d.getData())
  }))
}

function makeLoadDescriptors(fr) {
  return function(rawDescriptors) {
    checkDescriptors(rawDescriptors)
    return rawDescriptors.map(ds => ({
      className: ds.className,
      faceDescriptors: ds.faceDescriptors.map(d => new fr.Array(d))
    }))
  }
}

function toDescriptorState(descriptorsByClass) {
  return descriptorsByClass.map(d => ({ className: d.className, numFaces: d.faceDescriptors.length }))
}

/* compute the mean value of the euclidean distances of the input descriptor */
/* to each of the face descriptors, which the recognizer has been trained on, */
/* this is used as the metric to judge how similar the faces are to the training data*/
function makeComputeMeanDistance(fr) {
  return function(descriptors, inputDescriptor) {
    return round(
      descriptors
        .map(d => fr.distance(d, inputDescriptor))
        .reduce((d1, d2) => d1 + d2, 0)
          / (descriptors.length || 1)
      )
  }
}

/* make sligthly rotated, scaled and mirrored variants of the input image */
/* can be useful to increase the training set in order to get better results */
/* but also training time increases with numJitters  */
function makeGetJitteredFaces(fr) {
  return function(face, numJitters) {
    if (numJitters && (face.rows !== face.cols)) {
      throw new Error('jittering requires the face to have the same number of rows and cols')
    }
    return [face].concat(!numJitters ? [] : fr.jitterImage(face, numJitters))
  }
}

function getBestPrediction(predictions, unknownThreshold) {
  const best = predictions.sort((p1, p2) => p1.distance - p2.distance)[0]
  if (unknownThreshold && best.distance >= unknownThreshold) {
    best.className = 'unknown'
  }
  return best
}

function makeAddFaceDescriptors(descriptorsByClass) {
  return function(faceDescriptors, className) {
    const idx = descriptorsByClass.findIndex(d => d.className === className)
    if (idx === -1) {
      descriptorsByClass.push({
        className,
        faceDescriptors
      })
      return
    }
    descriptorsByClass[idx].faceDescriptors = descriptorsByClass[idx].faceDescriptors.concat(faceDescriptors)
  }
}

module.exports = {
  flatten,
  serializeDescriptors,
  toDescriptorState,
  makeLoadDescriptors,
  makeComputeMeanDistance,
  makeGetJitteredFaces,
  makeAddFaceDescriptors,
  getBestPrediction
}
