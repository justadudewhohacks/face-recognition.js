const path = require('path')
const { expect } = require('chai')

const fr = require('../')
const { dataDir } = require('./commons')
const AsyncFaceRecognizerTest = require('./FaceRecognizer/AsyncFaceRecognizerTest')
const FaceRecognizerTest = require('./FaceRecognizer/FaceRecognizerTest')

const facesPath = path.resolve(dataDir, 'faces')

function loadFace(faceFile) {
  return fr.loadImage(path.resolve(facesPath, faceFile))
}

function loadTrainFaces() {
  return ({
    sheldon: ['sheldon_1.png', 'sheldon_2.png'].map(loadFace),
    raj: ['raj_1.png', 'raj_2.png'].map(loadFace)
  })
}

function loadTestFaces() {
  return ({
    sheldon: loadFace('sheldon_3.png'),
    raj: loadFace('raj_3.png')
  })
}

describe('FaceRecognizer', () => {
  FaceRecognizerTest(
    () => fr.FaceRecognizer(),
    loadTrainFaces,
    loadTestFaces
  )

  AsyncFaceRecognizerTest(
    () => fr.AsyncFaceRecognizer(),
    loadTrainFaces,
    loadTestFaces
  )
})

