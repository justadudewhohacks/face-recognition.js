const path = require('path')
const fs = require('fs')
const {
  fr,
  drawRects,
  getAppdataPath,
  ensureAppdataDirExists
} = require('./commons')

ensureAppdataDirExists()

const trainedModelFile = 'faceRecognition2Model_150.json'
const trainedModelFilePath = path.resolve(getAppdataPath(), trainedModelFile)

const dataPath = path.resolve('./data/faces')
const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart']

const detector = fr.FaceDetector()
const recognizer = fr.FaceRecognizer()

if (!fs.existsSync(trainedModelFilePath)) {
  console.log('%s not found, start training recognizer...', trainedModelFile)
  const allFiles = fs.readdirSync(dataPath)
  const imagesByClass = classNames.map(c =>
    allFiles
      .filter(f => f.includes(c))
      .map(f => path.join(dataPath, f))
      .map(fp => fr.loadImage(fp))
  )

  imagesByClass.forEach((faces, label) =>
    recognizer.addFaces(faces, classNames[label]))

  fs.writeFileSync(trainedModelFilePath, JSON.stringify(recognizer.serialize()));
} else {
  console.log('found %s, loading model', trainedModelFile)

  recognizer.load(require(trainedModelFilePath))

  console.log('imported the following descriptors:')
  console.log(recognizer.getDescriptorState())
}

const bbtThemeImg = fr.loadImage('./data/bbt-theme.jpg')
console.log('detecting faces for query image')
const faceRects = detector.locateFaces(bbtThemeImg).map(res => res.rect)
const faces = detector.getFacesFromLocations(bbtThemeImg, faceRects, 150)

const win = new fr.ImageWindow()
win.setImage(bbtThemeImg)
drawRects(win, faceRects)

const unknownThreshold = 0.6
faceRects.forEach((rect, i) => {
  const prediction = recognizer.predictBest(faces[i], unknownThreshold)
  win.addOverlay(rect, `${prediction.className} (${prediction.distance})`)
})
fr.hitEnterToContinue()