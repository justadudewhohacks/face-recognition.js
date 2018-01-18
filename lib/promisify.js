const isFn = obj => typeof obj === 'function'
const isAsyncFn = fn => fn.prototype.constructor.name.endsWith('Async')

const promisify = (fn) => function () {
  if (isFn(arguments[arguments.length - 1])) {
    return fn.apply(this, arguments)
  }

  return new Promise((resolve, reject) => {
    const args = Array.prototype.slice.call(arguments)
    args.push(function(err, res) {
      if (err) {
        return reject(err)
      }
      return resolve(res)
    })

    try {
      fn.apply(this, args)
    } catch (err) {
      return reject(err)
    }
  })
}

module.exports = (fr) => {
  const fns = Object.keys(fr).filter(k => isFn(fr[k])).map(k => fr[k])
  const asyncFuncs = fns.filter(isAsyncFn)
  const clazzes = fns.filter(fn => !!Object.keys(fn.prototype).length)

  clazzes.forEach((clazz) => {
    const protoFnKeys = Object.keys(clazz.prototype).filter(k => isAsyncFn(clazz.prototype[k]))
    protoFnKeys.forEach(k => clazz.prototype[k] = promisify(clazz.prototype[k]))
  })

  asyncFuncs.forEach((fn) => {
    fr[fn.prototype.constructor.name] = promisify(fn)
  })

  return fr
}