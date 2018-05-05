const { expect } = require('chai')

module.exports = function(createFaceRecognizer, loadTrainFaces, loadTestFaces) {

  describe('AsyncFaceRecognizer', () => {

    it('can be created', () => {
      expect(
        createFaceRecognizer
      ).to.not.throw()
    })

    it('can be trained', (done) => {
      const recognizer = createFaceRecognizer()

      const trainFaces = loadTrainFaces()

      Promise.all([
        recognizer.addFaces(trainFaces.sheldon, 'sheldon'),
        recognizer.addFaces(trainFaces.raj, 'raj')
      ])
        .then(() => {
          const modelState = recognizer.getDescriptorState()
          expect(modelState).to.be.an('array').lengthOf(2)
          expect(modelState).to.deep.have.members([
            { className: 'sheldon', numFaces: 2 },
            { className: 'raj', numFaces: 2 }
          ])

          done()
        })
        .catch(err => done(err))
    })

    it('can be trained with jittering', (done) => {
      const recognizer = createFaceRecognizer()

      const numJitters = 1;

      const trainFaces = loadTrainFaces()

      Promise.all([
        recognizer.addFaces(trainFaces.sheldon, 'sheldon', numJitters),
        recognizer.addFaces(trainFaces.raj, 'raj', numJitters)
      ])
        .then(() => {
          const modelState = recognizer.getDescriptorState()
          expect(modelState).to.be.an('array').lengthOf(2)
          expect(modelState).to.deep.have.members([
            { className: 'sheldon', numFaces: 4 },
            { className: 'raj', numFaces: 4 }
          ])

          done()
        })
        .catch(err => done(err))
    })

    it('predict', (done) => {
      const recognizer = createFaceRecognizer()

      const trainFaces = loadTrainFaces()

      const testFaces = loadTestFaces()

      function getPrediction(predictions, className) {
        const prediction = predictions.find(p => p.className === className)
        expect(prediction).to.not.be.undefined
        return prediction
      }

      Promise.all([
        recognizer.addFaces(trainFaces.sheldon, 'sheldon'),
        recognizer.addFaces(trainFaces.raj, 'raj')
      ])
        .then(() =>
          Promise.all([
            recognizer.predict(testFaces.sheldon),
            recognizer.predict(testFaces.raj)
          ])
        )
        .then(([p1, p2]) => {
          expect(p1).to.be.an('array').lengthOf(2)
          expect(p1.map(p => p.className)).to.contain('sheldon')
          expect(p1.map(p => p.className)).to.contain('raj')
          expect(getPrediction(p1, 'sheldon').distance).to.be.lessThan(getPrediction(p1, 'raj').distance)

          expect(p2).to.be.an('array').lengthOf(2)
          expect(p2.map(p => p.className)).to.contain('sheldon')
          expect(p2.map(p => p.className)).to.contain('raj')
          expect(getPrediction(p2, 'raj').distance).to.be.lessThan(getPrediction(p2, 'sheldon').distance)

          done()
        })
        .catch(err => done(err))
    })

    it('predictBest', (done) => {
      const recognizer = createFaceRecognizer()

      const trainFaces = loadTrainFaces()

      const testFaces = loadTestFaces()

      Promise.all([
        recognizer.addFaces(trainFaces.sheldon, 'sheldon'),
        recognizer.addFaces(trainFaces.raj, 'raj')
      ])
        .then(() =>
          Promise.all([
            recognizer.predictBest(testFaces.sheldon),
            recognizer.predictBest(testFaces.raj)
          ])
        )
        .then(([p1, p2]) => {
          expect(p1).to.have.property('distance').to.be.above(0)
          expect(p1).to.have.property('className').to.be.equal('sheldon')

          expect(p2).to.have.property('distance').to.be.above(0)
          expect(p2).to.have.property('className').to.be.equal('raj')

          done()
        })
        .catch(err => done(err))
    })

  })

}

