const path = require('path')
const fs = require('fs')
const df = require('../')

exports.df = df

exports.drawRects = (win, rects) =>
  rects.forEach(rect => win.addOverlay(rect))

exports.rescaleRect = (rect, f) =>
  new df.Rect(rect.left * f, rect.top * f, rect.right * f, rect.bottom * f)

function loadModel(modelFile) {
  const modelPath = path.resolve(path.join('./models', modelFile))
  if (!fs.existsSync(modelPath)) {
    console.log('%s not found', modelFile)
    console.log('get the model from https://github.com/davisking/dlib-models')
    throw new Error('exiting')
  }
  return modelPath
}

exports.loadFace5LandmarkPredictor = () =>
  new df.ShapePredictor(loadModel('shape_predictor_5_face_landmarks.dat'))
exports.loadFace68LandmarkPredictor = () =>
  new df.ShapePredictor(loadModel('shape_predictor_68_face_landmarks.dat'))
exports.loadFaceNet = () =>
  new df.FaceDetectorNet(loadModel('mmod_human_face_detector.dat'))