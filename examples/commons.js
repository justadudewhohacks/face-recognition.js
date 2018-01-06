const fr = require('../')

exports.fr = fr

exports.drawRects = (win, rects) =>
  rects.forEach(rect => win.addOverlay(rect))

exports.rescaleRect = (rect, f) =>
  new fr.Rect(rect.left * f, rect.top * f, rect.right * f, rect.bottom * f)
