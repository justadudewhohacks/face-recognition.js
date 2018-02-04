import fr = require('../../../');

const detector = new fr.FrontalFaceDetector();
const face5LandmarkPredictor = fr.FaceLandmark5Predictor();
const face68LandmarkPredictor = fr.FaceLandmark68Predictor();

const img = fr.loadImage('../../data/Lenna.png');
const faceRects = detector.detect(img);
const shapes5 = faceRects.map((rect) => face5LandmarkPredictor.predict(img, rect));
console.log('5 face landmarks:');
console.log(shapes5);

const win1 = new fr.ImageWindow();
win1.setImage(img);
win1.renderFaceDetections(shapes5);

const shapes68 = faceRects.map((rect) => face68LandmarkPredictor.predict(img, rect));
console.log('68 face landmarks:');
console.log(shapes68);

const win2 = new fr.ImageWindow();
win2.setImage(img);
win2.renderFaceDetections(shapes68);

fr.hitEnterToContinue();
