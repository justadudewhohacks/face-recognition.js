const path = require('path')
const fs = require('fs')
const fr = require('../')

exports.fr = fr

exports.drawRects = (win, rects) =>
  rects.forEach(rect => win.addOverlay(rect))

exports.rescaleRect = (rect, f) =>
  new fr.Rect(rect.left * f, rect.top * f, rect.right * f, rect.bottom * f)


const dataPath = path.resolve(__dirname, './data')
const appdataPath = path.resolve(__dirname, './appdata')

exports.getDataPath = () => dataPath

exports.getAppdataPath = () => appdataPath

exports.ensureAppdataDirExists = () => {
  if (!fs.existsSync(appdataPath)) {
    fs.mkdirSync(appdataPath);
  }
}

