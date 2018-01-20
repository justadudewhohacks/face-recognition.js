const path = require('path')
const { expect } = require('chai')

const fr = require('../')
const { dataDir } = require('./commons')

describe('FaceLandmarkPredictor', () => {

  describe('FaceLandmark5Predictor', () => {

    it('can be created', () => {
      expect(
        () => fr.FaceLandmark5Predictor()
      ).to.not.throw()
    })

    it('predict sync returns 5 point landmarks', () => {
      const img = fr.loadImage(path.resolve(dataDir, 'Lenna.png'))
      const detector = new fr.FrontalFaceDetector()
      const predictor = fr.FaceLandmark5Predictor()

      const faceRect = detector.detect(img)[0]

      expect(faceRect).to.be.instanceOf(fr.Rect)

      const shapes5 = predictor.predict(img, faceRect)

      expect(shapes5).to.have.property('numParts').to.equal(5)

      const points = shapes5.getParts()
      expect(points).to.be.an('array').lengthOf(5)
      points.forEach(pt => expect(pt).to.be.instanceOf(fr.Point))
    })

    it('predict async returns 5 point landmarks', (done) => {
      const img = fr.loadImage(path.resolve(dataDir, 'Lenna.png'))
      const detector = new fr.FrontalFaceDetector()
      const predictor = fr.FaceLandmark5Predictor()

      const faceRect = detector.detect(img)[0]

      expect(faceRect).to.be.instanceOf(fr.Rect)

      predictor.predictAsync(img, faceRect)
        .then((shapes5) => {
          expect(shapes5).to.have.property('numParts').to.equal(5)

          const points = shapes5.getParts()
          expect(points).to.be.an('array').lengthOf(5)
          points.forEach(pt => expect(pt).to.be.instanceOf(fr.Point))

          done()
        })
        .catch(err => done(err))
    })

  })

  describe('FaceLandmark68Predictor', () => {

    it('can be created', () => {
      expect(
        () => fr.FaceLandmark68Predictor()
      ).to.not.throw()
    })

    it('returns 68 point landmarks', () => {
      const img = fr.loadImage(path.resolve(dataDir, 'Lenna.png'))
      const detector = new fr.FrontalFaceDetector()
      const predictor = fr.FaceLandmark68Predictor()

      const faceRect = detector.detect(img)[0]

      expect(faceRect).to.be.instanceOf(fr.Rect)

      const shapes68 = predictor.predict(img, faceRect)

      expect(shapes68).to.have.property('numParts').to.equal(68)

      const points = shapes68.getParts()
      expect(points).to.be.an('array').lengthOf(68)
      points.forEach(pt => expect(pt).to.be.instanceOf(fr.Point))
    })

    it('predict async returns 68 point landmarks', (done) => {
      const img = fr.loadImage(path.resolve(dataDir, 'Lenna.png'))
      const detector = new fr.FrontalFaceDetector()
      const predictor = fr.FaceLandmark68Predictor()

      const faceRect = detector.detect(img)[0]

      expect(faceRect).to.be.instanceOf(fr.Rect)

      predictor.predictAsync(img, faceRect)
        .then((shapes68) => {
          expect(shapes68).to.have.property('numParts').to.equal(68)

          const points = shapes68.getParts()
          expect(points).to.be.an('array').lengthOf(68)
          points.forEach(pt => expect(pt).to.be.instanceOf(fr.Point))

          done()
        })
        .catch(err => done(err))
    })

  })

})

