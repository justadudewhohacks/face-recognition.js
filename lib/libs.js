const { resolvePath } = require('./utils')

const isWin = process.platform === 'win32'

const libFilePath = process.env.DLIB_LIB_DIR
  ? resolvePath(process.env.DLIB_LIB_DIR, isWin ? 'dlib.lib' : 'dlib.a')
  : resolvePath(require('dlib-build').dlibLib)

console.log(libFilePath)

if (!isWin) {
  console.log('-lX11')
  console.log('-lpng')
}