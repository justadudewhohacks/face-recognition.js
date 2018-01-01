const df = require('../')

exports.df = df

exports.drawRects = (win, rects) =>
  rects.forEach(rect => win.addOverlay(rect))

exports.rescaleRect = (rect, f) =>
  new df.Rect(rect.left * f, rect.top * f, rect.right * f, rect.bottom * f)