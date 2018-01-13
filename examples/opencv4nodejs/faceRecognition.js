const path = require('path')
const fs = require('fs')
const cv = require('opencv4nodejs')
const fr = require('../../').withCv(cv)
const {
  getDataPath,
  getAppdataPath
} = require('../commons')

const trainedModelFile = 'faceRecognition2Model_150.json'
const trainedModelFilePath = path.resolve(getAppdataPath(), trainedModelFile)

const detector = fr.FaceDetector()
const recognizer = fr.FaceRecognizer()

if (!fs.existsSync(trainedModelFilePath)) {
  throw new Error('model file not found, please run the faceRecognition2 example first to train and save the model')
} else {
  recognizer.load(require(trainedModelFilePath))
}

// opencv way to detect faces, faster but not as precise
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
const minDetections = 5

function detectFaces(img, faceSize) {
  const { objects, numDetections } = classifier.detectMultiScale(img.bgrToGray())
  return objects
    .filter((_, i) => minDetections <= numDetections[i])
    .map(rect => ({
      rect,
      face: img.getRegion(rect).resize(faceSize, faceSize)
    }))
}

function drawRectWithText(image, rect, text, color) {
  const thickness = 2
  image.drawRectangle(
    new cv.Point(rect.x, rect.y),
    new cv.Point(rect.x + rect.width, rect.y + rect.height),
    color,
    cv.LINE_8,
    thickness
  )

  const textOffsetY = rect.height + 20
  image.putText(
    text,
    new cv.Point(rect.x, rect.y + textOffsetY),
    cv.FONT_ITALIC,
    0.6,
    color,
    thickness
  )
}

const bbtThemeImgs = fs.readdirSync(getDataPath())
  .filter(f => f.includes('bbt'))
  .map(f => path.join(getDataPath(), f))
  .map(fp => cv.imread(fp))

bbtThemeImgs.forEach((_img, i) => {
  let img = _img

  // resize image if too small
  const minPxSize = 400000
  if ((img.cols * img.rows) < minPxSize) {
    img = _img.rescale(minPxSize / (img.cols * img.rows))
  }

  console.log('detecting faces for query image')
  const detections = detectFaces(img, 150)

  const drawImg = img.copy()
  // mark faces with distance > 0.6 as unknown
  const unknownThreshold = 0.6
  detections.forEach((det) => {
    const { rect, face } = det
    const cvFace = fr.CvImage(face)
    const prediction = recognizer.predictBest(cvFace, unknownThreshold)

    const text = `${prediction.className} (${prediction.distance})`
    const blue = new cv.Vec(255, 0, 0)
    drawRectWithText(drawImg, rect, text, blue)

    console.log(prediction)
    cv.imshow(`image_${i})`, drawImg)
    cv.waitKey(1)
  })
})

cv.waitKey()

