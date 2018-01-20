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

  it('can save and load the state', () => {
    const recognizer1 = fr.FaceRecognizer()
    const recognizer2 = fr.FaceRecognizer()

    const trainFaces = loadTrainFaces()
    recognizer1.addFaces(trainFaces.sheldon, 'sheldon')
    recognizer1.addFaces(trainFaces.raj, 'raj')

    const state1 = recognizer1.serialize()
    expect(state1).to.be.an('array').lengthOf(2)
    state1.forEach((descs) => {
      expect(descs.className).to.be.a('string')
      expect(descs.faceDescriptors).to.be.an('array').lengthOf(2)
      descs.faceDescriptors.forEach(fd => expect(fd).to.be.an('array').lengthOf(128))
    })

    recognizer2.load(state1)
    expect(recognizer2.serialize()).to.deep.equal(state1)
    expect(recognizer2.getDescriptorState()).to.be.an('array').lengthOf(2)
    expect(recognizer2.getDescriptorState()).to.deep.equal(recognizer1.getDescriptorState())
  })

})

