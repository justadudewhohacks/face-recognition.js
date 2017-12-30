const path = require('path')

exports.resolvePath = (filePath, file) => {
  if (!filePath) {
    return undefined
  }
  return (file ? path.resolve(filePath, file) : path.resolve(filePath)).replace(/\\/g, '/')
}