import fr = require('../../../');

const detector = new fr.FrontalFaceDetector();
const face5LandmarkPredictor = fr.FaceLandmark5Predictor();
const face68LandmarkPredictor = fr.FaceLandmark68Predictor();

const img = fr.loadImage('../../data/Lenna.png');
const faceRects = detector.detect(img);

Promise.all([
    Promise.all(faceRects.map((rect) => face5LandmarkPredictor.predictAsync(img, rect))),
    Promise.all(faceRects.map((rect) => face68LandmarkPredictor.predictAsync(img, rect)))
])
    .then(([shapes5, shapes68]) => {
        const win1 = new fr.ImageWindow();
        const win2 = new fr.ImageWindow();
        win1.setImage(img);
        win2.setImage(img);
        win1.renderFaceDetections(shapes5);
        win2.renderFaceDetections(shapes68);
        fr.hitEnterToContinue();
    })
    .catch((err) => {
        console.error(err);
    });
