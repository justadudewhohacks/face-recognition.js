const { resolvePath } = require('./utils')

console.log(resolvePath(process.env.DLIB_LIB_DIR, 'dlib.lib'))