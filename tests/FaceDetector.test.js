const path = require('path')
const { expect } = require('chai')

const fr = require('../')
const { dataDir } = require('./commons')

describe('FaceDetector', () => {

  it('can be created', () => {
    expect(
      () => fr.FaceDetector()
    ).to.not.throw()
  })

  it('detects single face', () => {
    const detector = fr.FaceDetector()

    const lenna = fr.loadImage(path.resolve(dataDir, 'Lenna.png'))

    const faceSize = 150
    const lennaFaces = detector.detectFaces(lenna, faceSize)

    expect(lennaFaces.length).to.equal(1)
    lennaFaces.forEach(f => expect(f).to.be.instanceOf(fr.ImageRGB))
  })

  it('detects multiple face', () => {
    const detector = fr.FaceDetector()

    const got = fr.loadImage(path.resolve(dataDir, 'got.jpg'))

    const faceSize = 150
    const gotFaces = detector.detectFaces(got, faceSize)

    expect(gotFaces.length).to.equal(4)
    gotFaces.forEach(f => expect(f).to.be.instanceOf(fr.ImageRGB))
  })

})

