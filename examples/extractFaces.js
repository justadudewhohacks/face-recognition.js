const {
  df,
  drawRects,
  loadFaceNet,
  loadFace68LandmarkPredictor
} = require('./commons')

const net = loadFaceNet()
const face68LandmarkPredictor = loadFace68LandmarkPredictor()

const img = df.loadImage('./data/got.jpg')
const faceRects = net.detect(img).map(mmodRect => mmodRect.rect)
const shapes68 = faceRects.map(rect => face68LandmarkPredictor.predict(img, rect))
const details = df.getFaceChipDetails(shapes68)
const faceChips =  df.extractImageChips(img, details)
const tileImages = df.tileImages(faceChips)
const win = new df.ImageWindow()
win.setImage(tileImages)

df.hitEnterToContinue()

