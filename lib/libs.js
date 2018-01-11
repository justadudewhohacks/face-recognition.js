const { resolvePath } = require('./utils')

const isWin = process.platform === 'win32'

if (isWin) {
    const libFilePath = process.env.DLIB_LIB_DIR
      ? resolvePath(process.env.DLIB_LIB_DIR, 'dlib.lib')
      : resolvePath(require('dlib-build').dlibLib)

    console.log(libFilePath)
    return
}

const dlibLibDir = process.env.DLIB_LIB_DIR
  ? process.env.DLIB_LIB_DIR
  : require('dlib-build').dlibLibDir

console.log('-L' + dlibLibDir)
console.log('-ldlib')
console.log('-Wl,-rpath,' + dlibLibDir)

// TODO fix link X11 on mac osx
console.log('-lX11')
console.log('-lpng')