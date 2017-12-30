let df;
if (process.env.BINDINGS_DEBUG) {
  df = require('../build/Debug/dfacejs')
} else {
  df = require('../build/Release/dfacejs')
}

module.exports = df