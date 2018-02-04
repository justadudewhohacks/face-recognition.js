import fr = require('../../../');
import { drawRects, rescaleRect } from './commons';

const detector = new fr.FrontalFaceDetector();

const lenna = fr.loadImage('../../data/Lenna.png');
const lennaFaceRects = detector.detect(lenna);
console.log('detection result for Lenna.png:');
console.log(lennaFaceRects);

const win1 = new fr.ImageWindow();
win1.setImage(lenna);
drawRects(win1, lennaFaceRects);

const got = fr.loadImage('../../data/got.jpg');
// scale image up to detect smaller faces
const gotBig = fr.pyramidUp(got);
const gotBigFaceRects = detector.detect(gotBig);
console.log('detection result for got.jpg:');
console.log(gotBigFaceRects);

// scale detected rectangles back to original image size
const gotFaceRects = gotBigFaceRects.map((rect) => rescaleRect(rect, 0.5));

const win2 = new fr.ImageWindow();
win2.setImage(got);
drawRects(win2, gotFaceRects);

fr.hitEnterToContinue();
