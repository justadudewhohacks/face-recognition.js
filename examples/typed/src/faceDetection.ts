import fr = require('../../../');

fr.winKillProcessOnExit();

const img = fr.loadImage('../../data/got.jpg');

const detector = fr.FaceDetector();

const faces = detector.detectFaces(img, 150);

const win = new fr.ImageWindow();
win.setImage(fr.tileImages(faces));

fr.hitEnterToContinue();
