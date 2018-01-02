const {
  df,
  drawRects,
  loadFace5LandmarkPredictor,
  loadFace68LandmarkPredictor
} = require('./commons')

const detector = new df.FrontalFaceDetector()

const img = df.loadImage('./data/Lenna.png')
const faceRects = detector.detect(img)

const face5LandmarkPredictor = loadFace5LandmarkPredictor()
const shapes5 = faceRects.map(rect => face5LandmarkPredictor.predict(img, rect))
console.log('5 face landmarks:')
console.log(shapes5)

const win1 = new df.ImageWindow()
win1.setImage(img)
win1.renderFaceDetections(shapes5)

const face68LandmarkPredictor = loadFace68LandmarkPredictor()
const shapes68 = faceRects.map(rect => face68LandmarkPredictor.predict(img, rect))
console.log('68 face landmarks:')
console.log(shapes68)

const win2 = new df.ImageWindow()
win2.setImage(img)
win2.renderFaceDetections(shapes68)

df.hitEnterToContinue()



