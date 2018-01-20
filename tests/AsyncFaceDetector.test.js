const path = require('path')
const { expect } = require('chai')

const fr = require('../')
const { dataDir } = require('./commons')

describe('AsyncFaceDetector', () => {

  it('can be created', () => {
    expect(
      () => fr.AsyncFaceDetector()
    ).to.not.throw()
  })

  it('detects single face', (done) => {
    const detector = fr.AsyncFaceDetector()

    const lenna = fr.loadImage(path.resolve(dataDir, 'Lenna.png'))

    const faceSize = 150
    detector.detectFaces(lenna, faceSize)
      .then((lennaFaces) => {
        expect(lennaFaces.length).to.equal(1)
        lennaFaces.forEach(f => expect(f).to.be.instanceOf(fr.ImageRGB))

        done()
      })
      .catch(err => done(err))
  })

  it('detects multiple face', (done) => {
    const detector = fr.AsyncFaceDetector()

    const got = fr.loadImage(path.resolve(dataDir, 'got.jpg'))

    const faceSize = 150
    detector.detectFaces(got, faceSize)
      .then((gotFaces) => {
        expect(gotFaces.length).to.equal(4)
        gotFaces.forEach(f => expect(f).to.be.instanceOf(fr.ImageRGB))

        done()
      })
      .catch(err => done(err))
  })

})

