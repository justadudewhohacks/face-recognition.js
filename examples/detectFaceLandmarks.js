const path = require('path')
const fs = require('fs')
const {
  df,
  drawRects
} = require('./commons')

function loadFaceLandmarkPredictor(modelFile) {
  const modelPath = path.resolve(path.join('./models', modelFile))
  if (!fs.existsSync(modelPath)) {
    console.log('%s not found', modelFile)
    console.log('get the model from https://github.com/davisking/dlib-models')
    throw new Error('exiting')
  }
  return new df.ShapePredictor(modelPath)
}

const loadFace5LandmarkPredictor = () => loadFaceLandmarkPredictor('shape_predictor_5_face_landmarks.dat')
const loadFace68LandmarkPredictor = () => loadFaceLandmarkPredictor('shape_predictor_68_face_landmarks.dat')

const detector = new df.FrontalFaceDetector()

const lenna = df.loadImage('./data/Lenna.png')
const lennaFaceRects = detector.detect(lenna)

const face5LandmarkPredictor = loadFace5LandmarkPredictor()
const shapes5 = lennaFaceRects.map(rect => face5LandmarkPredictor.predict(lenna, rect))
console.log('5 face landmarks:')
console.log(shapes5)

const win1 = new df.ImageWindow()
win1.setImage(lenna)
win1.renderFaceDetections(shapes5)

const face68LandmarkPredictor = loadFace68LandmarkPredictor()
const shapes68 = lennaFaceRects.map(rect => face68LandmarkPredictor.predict(lenna, rect))
console.log('68 face landmarks:')
console.log(shapes68)

const win2 = new df.ImageWindow()
win2.setImage(lenna)
win2.renderFaceDetections(shapes68)

df.hitEnterToContinue()



