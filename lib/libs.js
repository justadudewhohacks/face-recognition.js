const { resolvePath } = require('./utils')
const dlib = process.platform === 'win32' ? 'dlib.lib' : 'dlib.so'

console.log(resolvePath(process.env.DLIB_LIB_DIR, dlib))