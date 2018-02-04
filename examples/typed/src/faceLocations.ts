import fr = require('../../../');
import { drawRects } from './commons';

fr.winKillProcessOnExit();

const detector = fr.FaceDetector();

const lenna = fr.loadImage('../../data/Lenna.png');

console.log('detecting faces for Lenna.png');
const resultLenna = detector.locateFaces(lenna);
console.log('detection result for Lenna.png:');
console.log(resultLenna);

const lennaFaceRects = resultLenna.map((mmodRect) => mmodRect.rect);
const win1 = new fr.ImageWindow();
win1.setImage(lenna);
drawRects(win1, lennaFaceRects);

const got = fr.loadImage('../../data/got.jpg');
console.log('detecting faces for got.jpg');
const resultGot = detector.locateFaces(got);
console.log('detection result for got.jpg:');
console.log(resultGot);

const gotFaceRects = resultGot.map((mmodRect) => mmodRect.rect);
const win2 = new fr.ImageWindow();
win2.setImage(got);
drawRects(win2, gotFaceRects);

fr.hitEnterToContinue();
