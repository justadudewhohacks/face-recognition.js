let fr

if (process.env.BINDINGS_DEBUG) {
  fr = require('../build/Debug/facerec')
} else {
  fr = require('../build/Release/facerec')
}

module.exports = fr