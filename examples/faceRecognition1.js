const path = require('path')
const fs = require('fs')
const {
  fr,
  getAppdataPath,
  ensureAppdataDirExists
} = require('./commons')

ensureAppdataDirExists()

const trainedModelFile = 'faceRecognition1Model_150.json'
const trainedModelFilePath = path.resolve(getAppdataPath(), trainedModelFile)

const dataPath = path.resolve('./data/facerec')
const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart']

const recognizer = fr.FaceRecognizer()

const allFiles = fs.readdirSync(dataPath)
const imagesByClass = classNames.map(c =>
  allFiles
    .filter(f => f.includes(c))
    .map(f => path.join(dataPath, f))
    .map(fp => fr.loadImage(fp))
)
const trainDataByClass = imagesByClass.map(imgs => imgs.slice(0, 10))
const testDataByClass = imagesByClass.map(imgs => imgs.slice(10))

if (!fs.existsSync(trainedModelFilePath)) {
  console.log('%s not found, start training recognizer...', trainedModelFile)

  trainDataByClass.forEach((faces, label) => {
    const name = classNames[label]
    recognizer.addFaces(faces, name)
  })

  fs.writeFileSync(trainedModelFilePath, JSON.stringify(recognizer.serialize()));
} else {
  console.log('found %s, loading model', trainedModelFile)

  recognizer.load(require(trainedModelFilePath))

  console.log('imported the following descriptors:')
  console.log(recognizer.getDescriptorState())
}

testDataByClass.forEach((faces, label) => {
  console.log()
  console.log('testing %s', classNames[label])
  faces.forEach((face, i) => {
    const prediction = recognizer.predictBest(face)
    console.log('%s (%s)', prediction.className, prediction.distance)
  })
})
