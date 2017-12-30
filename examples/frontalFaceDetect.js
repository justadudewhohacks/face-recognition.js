const path = require('path')
const df = require('../')

const drawRects = (win, rects) =>
  rects.forEach(rect => win.addOverlay(rect))

const rescaleRect = (rect, f) =>
  new df.Rect(rect.left * f, rect.top * f, rect.right * f, rect.bottom * f)

const detector = new df.FrontalFaceDetector()

const lenna = df.loadImage('./data/Lenna.png')
const lennaFaceRects = detector.detect(lenna)

const win1 = new df.ImageWindow()
win1.setImage(lenna)
drawRects(win1, lennaFaceRects)

const got = df.loadImage('./data/got.jpg')
// scale image up to detect smaller faces
const gotBig = df.pyramidUp(got);
const gotFaceRects = detector.detect(gotBig)

const win2 = new df.ImageWindow()
win2.setImage(got)
drawRects(win2, gotFaceRects.map(rect => rescaleRect(rect, 0.5)))

df.hitEnterToContinue()



