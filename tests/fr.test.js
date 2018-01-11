const path = require('path')
const { expect } = require('chai')

const fr = require('../')
const { dataDir } = require('./commons')

describe('fr', () => {

  it('should load png image', () => {
    expect(
      () => fr.loadImage(path.resolve(dataDir, 'Lenna.png'))
    ).to.not.throw()
  })

  it('should load jpg image', () => {
    expect(
      () => fr.loadImage(path.resolve(dataDir, 'got.jpg'))
    ).to.not.throw()
  })

})