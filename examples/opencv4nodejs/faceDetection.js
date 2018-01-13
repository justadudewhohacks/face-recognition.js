const path = require('path')
const cv = require('opencv4nodejs')
const fr = require('../../').withCv(cv)

const {
  getDataPath
} = require('../commons')

fr.winKillProcessOnExit()

const detector = fr.FaceDetector()

const mat = cv.imread(path.resolve(getDataPath(), 'got.jpg'))
const cvImg = fr.CvImage(mat)

console.log('detecting faces')
const faceRects =  detector.locateFaces(cvImg)

const faces = faceRects
  .map(mmodRect => fr.toCvRect(mmodRect.rect))
  .map(cvRect => mat.getRegion(cvRect).copy())

faces.forEach((face, i) => {
  cv.imshow(`face_${i}`, face)
})
cv.waitKey()
