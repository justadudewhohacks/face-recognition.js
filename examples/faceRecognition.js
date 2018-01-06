const path = require('path')
const fs = require('fs')
const {
  fr
} = require('./commons')
const FaceRecognizer = require('./FaceRecognizer')

const dataPath = path.resolve('./data/facerec')
const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart']

const recognizer = FaceRecognizer()

console.log('loading data')
const allFiles = fs.readdirSync(dataPath)
const imagesByClass = classNames.map(c =>
  allFiles
    .filter(f => f.includes(c))
    .map(f => path.join(dataPath, f))
    .map(fp => fr.loadImage(fp))
)
const trainDataByClass = imagesByClass.map(imgs => imgs.slice(0, 10))
const testDataByClass = imagesByClass.map(imgs => imgs.slice(10))

console.log('training')
trainDataByClass.forEach((faces, label) => {
  const name = classNames[label]
  recognizer.addFaces(faces, name)
})

testDataByClass.forEach((faces, label) => {
  console.log()
  console.log('testing %s', classNames[label])
  faces.forEach((face, i) => {
    const prediction = recognizer.predictBest(face)
    console.log('%s (%s)', prediction.className, prediction.distance)
  })
})
