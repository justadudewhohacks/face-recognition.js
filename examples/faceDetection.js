const { fr } = require('./commons')

fr.winKillProcessOnExit()

const detector = fr.FaceDetector()

const img = fr.loadImage('./data/got.jpg')

console.log('detecting faces')
const faceSize = 150
const faces = detector.detectFaces(img, faceSize)

const win = new fr.ImageWindow()
win.setImage(fr.tileImages(faces))
fr.hitEnterToContinue()

