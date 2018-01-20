const { expect } = require('chai')

module.exports = function(createFaceRecognizer, loadTrainFaces, loadTestFaces) {

  describe('FaceRecognizer', () => {

    it('can be created', () => {
      expect(
        createFaceRecognizer
      ).to.not.throw()
    })

    it('can be trained', () => {
      const recognizer = createFaceRecognizer()

      const trainFaces = loadTrainFaces()
      recognizer.addFaces(trainFaces.sheldon, 'sheldon')
      recognizer.addFaces(trainFaces.raj, 'raj')

      const modelState = recognizer.getDescriptorState()
      expect(modelState).to.be.an('array').lengthOf(2)
      expect(modelState).to.deep.have.members([
        { className: 'sheldon', numFaces: 2 },
        { className: 'raj', numFaces: 2 }
      ])
    })

    it('can be trained with jittering', () => {
      const recognizer = createFaceRecognizer()

      const numJitters = 1;

      const trainFaces = loadTrainFaces()
      recognizer.addFaces(trainFaces.sheldon, 'sheldon', numJitters)
      recognizer.addFaces(trainFaces.raj, 'raj', numJitters)

      const modelState = recognizer.getDescriptorState()
      expect(modelState).to.be.an('array').lengthOf(2)
      expect(modelState).to.deep.have.members([
        { className: 'sheldon', numFaces: 4 },
        { className: 'raj', numFaces: 4 }
      ])
    })

    it('predict', () => {
      const recognizer = createFaceRecognizer()

      const trainFaces = loadTrainFaces()

      recognizer.addFaces(trainFaces.sheldon, 'sheldon')
      recognizer.addFaces(trainFaces.raj, 'raj')

      const testFaces = loadTestFaces()

      function getPrediction(predictions, className) {
        const prediction = predictions.find(p => p.className === className)
        expect(prediction).to.not.be.undefined
        return prediction
      }

      const p1 = recognizer.predict(testFaces.sheldon)
      expect(p1).to.be.an('array').lengthOf(2)
      expect(p1.map(p => p.className)).to.contain('sheldon')
      expect(p1.map(p => p.className)).to.contain('raj')
      expect(getPrediction(p1, 'sheldon').distance).to.be.lessThan(getPrediction(p1, 'raj').distance)

      const p2 = recognizer.predict(testFaces.raj)
      expect(p2).to.be.an('array').lengthOf(2)
      expect(p2.map(p => p.className)).to.contain('sheldon')
      expect(p2.map(p => p.className)).to.contain('raj')
      expect(getPrediction(p2, 'raj').distance).to.be.lessThan(getPrediction(p2, 'sheldon').distance)
    })

    it('predictBest', () => {
      const recognizer = createFaceRecognizer()

      const trainFaces = loadTrainFaces()

      recognizer.addFaces(trainFaces.sheldon, 'sheldon')
      recognizer.addFaces(trainFaces.raj, 'raj')

      const testFaces = loadTestFaces()

      const p1 = recognizer.predictBest(testFaces.sheldon)
      expect(p1).to.have.property('distance').to.be.above(0)
      expect(p1).to.have.property('className').to.be.equal('sheldon')

      const p2 = recognizer.predictBest(testFaces.raj)
      expect(p2).to.have.property('distance').to.be.above(0)
      expect(p2).to.have.property('className').to.be.equal('raj')
    })

  })

}

