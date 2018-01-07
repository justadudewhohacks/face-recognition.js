const { resolvePath } = require('./utils')
const dlib = process.platform === 'win32' ? 'dlib.lib' : 'dlib.so'

const libFilePath = process.env.DLIB_LIB_DIR
  ? resolvePath(process.env.DLIB_LIB_DIR, dlib)
  : resolvePath(require('dlib-build').dlibLib)

console.log(libFilePath)