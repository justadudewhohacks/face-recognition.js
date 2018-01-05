const path = require('path')
const fs = require('fs')
const fr = require('../')

exports.fr = fr

exports.drawRects = (win, rects) =>
  rects.forEach(rect => win.addOverlay(rect))

exports.rescaleRect = (rect, f) =>
  new fr.Rect(rect.left * f, rect.top * f, rect.right * f, rect.bottom * f)

function loadModel(modelFile) {
  const modelPath = path.resolve(path.join('./models', modelFile))
  if (!fs.existsSync(modelPath)) {
    console.log('%s not found', modelFile)
    console.log('get the model from https://github.com/davisking/dlib-models')
    throw new Error('exiting')
  }
  return modelPath
}

exports.loadModel = loadModel

exports.loadFace5LandmarkPredictor = () =>
  new fr.ShapePredictor(loadModel('shape_predictor_5_face_landmarks.dat'))
exports.loadFace68LandmarkPredictor = () =>
  new fr.ShapePredictor(loadModel('shape_predictor_68_face_landmarks.dat'))
exports.loadFaceDetectorNet = () =>
  new fr.FaceDetectorNet(loadModel('mmod_human_face_detector.dat'))
exports.loadFaceRecognizerNet = () =>
  new fr.FaceRecognizerNet(loadModel('dlib_face_recognition_resnet_model_v1.dat'))