import fr = require('../../../');
import { drawRects } from './commons';

fr.winKillProcessOnExit();

const detector = fr.AsyncFaceDetector();

const lenna = fr.loadImage('../../data/Lenna.png');
const got = fr.loadImage('../../data/got.jpg');

console.log('detecting faces async');

Promise.all([
    detector.locateFaces(lenna),
    detector.locateFaces(got)
])
    .then(([lennaDetections, gotDetections]) => {
        const lennaFaceRects = lennaDetections.map((mmodRect) => mmodRect.rect);
        const win1 = new fr.ImageWindow();
        win1.setImage(lenna);
        drawRects(win1, lennaFaceRects);

        const gotFaceRects = gotDetections.map((mmodRect) => mmodRect.rect);
        const win2 = new fr.ImageWindow();
        win2.setImage(got);
        drawRects(win2, gotFaceRects);

        fr.hitEnterToContinue();
    })
    .catch((err) => {
        console.error(err);
    });
