const {
  fr,
  drawRects,
  loadFaceDetectorNet
} = require('./commons')

const net = loadFaceDetectorNet()

const lenna = fr.loadImage('./data/Lenna.png')
console.log('detecting faces')
const lennaFaceRects = net.detect(lenna)
console.log('detection result for Lenna.png:')
console.log(lennaFaceRects)

const win1 = new fr.ImageWindow()
win1.setImage(lenna)
drawRects(win1, lennaFaceRects.map(mmodRect => mmodRect.rect))

const got = fr.loadImage('./data/got.jpg')
console.log('detecting faces')
const gotFaceRects = net.detect(got)
console.log('detection result for got.jpg:')
console.log(gotFaceRects)

const win2 = new fr.ImageWindow()
win2.setImage(got)
drawRects(win2, gotFaceRects.map(mmodRect => mmodRect.rect))

fr.hitEnterToContinue()

