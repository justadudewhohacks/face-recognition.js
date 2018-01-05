const {
  fr,
  drawRects,
  loadFaceDetectorNet,
  loadFace68LandmarkPredictor
} = require('./commons')

const net = loadFaceDetectorNet()
const face68LandmarkPredictor = loadFace68LandmarkPredictor()

const img = fr.loadImage('./data/got.jpg')
const faceRects = net.detect(img).map(mmodRect => mmodRect.rect)
const shapes68 = faceRects.map(rect => face68LandmarkPredictor.predict(img, rect))
const details = fr.getFaceChipDetails(shapes68)
const faceChips =  fr.extractImageChips(img, details)
const tileImages = fr.tileImages(faceChips)
const win = new fr.ImageWindow()
win.setImage(tileImages)

fr.hitEnterToContinue()

