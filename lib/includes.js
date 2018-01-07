const { resolvePath } = require('./utils')

const includePath = process.env.DLIB_INCLUDE_DIR
  ? resolvePath(DLIB_INCLUDE_DIR)
  : resolvePath(require('dlib-build').dlibIncludeDir)

console.log(includePath)