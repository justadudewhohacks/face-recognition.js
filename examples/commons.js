const path = require('path')
const fs = require('fs')
const fr = require('../')

exports.fr = fr

exports.drawRects = (win, rects) =>
  rects.forEach(rect => win.addOverlay(rect))

exports.rescaleRect = (rect, f) =>
  new fr.Rect(rect.left * f, rect.top * f, rect.right * f, rect.bottom * f)


const appdataPath = path.resolve('./appdata')

exports.getAppdataPath = () => appdataPath

exports.ensureAppdataDirExists = () => {
  if (!fs.existsSync(appdataPath)) {
    fs.mkdirSync(appdataPath);
  }
}

