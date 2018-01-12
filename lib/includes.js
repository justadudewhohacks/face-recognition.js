const { resolvePath } = require('./utils')

const includePath = process.env.DLIB_INCLUDE_DIR
  ? resolvePath(process.env.DLIB_INCLUDE_DIR)
  : resolvePath(require('dlib-build').dlibIncludeDir)

console.log(includePath)