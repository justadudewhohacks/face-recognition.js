const path = require('path')
const fs = require('fs')
const df = require('../')

const modelFile = path.resolve('./models/mmod_human_face_detector.dat')
if (!fs.existsSync(modelFile)) {
  console.log('mmod_human_face_detector.dat not found')
  console.log('get the model from https://github.com/davisking/dlib-models')
  throw new Error('exiting')
}

const net = new df.FaceDetectorNet(modelFile)

const lenna = df.loadImage('./data/Lenna.png')
const lennaFaceRects = net.detect(lenna)

const win1 = new df.ImageWindow()
win1.setImage(lenna)
drawRects(win1, lennaFaceRects)

const got = df.loadImage('./data/got.jpg')
// scale image up to detect smaller faces
const gotBig = df.pyramidUp(got);
const gotFaceRects = net.detect(gotBig)

const win2 = new df.ImageWindow()
win2.setImage(got)
drawRects(win2, gotFaceRects.map(rect => rescaleRect(rect, 0.5)))

df.hitEnterToContinue()

