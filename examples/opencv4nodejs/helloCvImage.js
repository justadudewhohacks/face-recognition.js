const path = require('path')
const cv = require('opencv4nodejs')

const {
  fr,
  getDataPath
} = require('../commons')

const mat = cv.imread(path.resolve(getDataPath(), 'got.jpg'))
const cvImg = fr.CvImage(mat)

const win = new fr.ImageWindow()
win.setImage(cvImg)
fr.hitEnterToContinue()