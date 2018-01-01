const path = require('path')
const fs = require('fs')
const {
  df,
  drawRects
} = require('./commons')

const modelFile = path.resolve('./models/mmod_human_face_detector.dat')
if (!fs.existsSync(modelFile)) {
  console.log('mmod_human_face_detector.dat not found')
  console.log('get the model from https://github.com/davisking/dlib-models')
  throw new Error('exiting')
}

const net = new df.FaceDetectorNet(modelFile)

const lenna = df.loadImage('./data/Lenna.png')
const lennaFaceRects = net.detect(lenna)
console.log('detection result for Lenna.png:')
console.log(lennaFaceRects)

const win1 = new df.ImageWindow()
win1.setImage(lenna)
drawRects(win1, lennaFaceRects.map(mmodRect => mmodRect.rect))

const got = df.loadImage('./data/got.jpg')
const gotFaceRects = net.detect(got)
console.log('detection result for got.jpg:')
console.log(gotFaceRects)

const win2 = new df.ImageWindow()
win2.setImage(got)
drawRects(win2, gotFaceRects.map(mmodRect => mmodRect.rect))

df.hitEnterToContinue()

