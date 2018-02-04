import fr = require('../../../');

fr.winKillProcessOnExit();

const detector = fr.AsyncFaceDetector();

const lenna = fr.loadImage('../../data/Lenna.png');
const got = fr.loadImage('../../data/got.jpg');

console.log('detecting faces');
const faceSize = 150;
Promise.all([
    detector.detectFaces(lenna, faceSize),
    detector.detectFaces(got, faceSize)
])
    .then(([lennaFaces, gotFaces]) => {
        const win1 = new fr.ImageWindow();
        const win2 = new fr.ImageWindow();
        win1.setImage(fr.tileImages(lennaFaces));
        win2.setImage(fr.tileImages(gotFaces));
        fr.hitEnterToContinue();
    })
    .catch((err) => {
        console.error(err);
    });
