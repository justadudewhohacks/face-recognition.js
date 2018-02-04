import * as fs from 'fs';
import * as path from 'path';
import fr = require('../../../');
import { drawRects, getAppdataPath, ensureAppdataDirExists } from './commons';

fr.winKillProcessOnExit();
ensureAppdataDirExists();

const trainedModelFile = 'faceRecognition2Model_150.json';
const trainedModelFilePath = path.resolve(getAppdataPath(), trainedModelFile);

const dataPath = path.resolve('../../data');
const facesPath = path.resolve(dataPath, 'faces');
const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart'];

const detector = fr.FaceDetector();
const recognizer = fr.FaceRecognizer();

if (!fs.existsSync(trainedModelFilePath)) {
    console.log('%s not found, start training recognizer...', trainedModelFile);
    const allFiles = fs.readdirSync(facesPath);
    const imagesByClass = classNames.map((c) =>
        allFiles
            .filter((f) => f.includes(c))
            .map((f) => path.join(facesPath, f))
            .map((fp) => fr.loadImage(fp))
    );

    imagesByClass.forEach((faces, label) =>
        recognizer.addFaces(faces, classNames[label]));

    fs.writeFileSync(trainedModelFilePath, JSON.stringify(recognizer.serialize()));
} else {
    console.log('found %s, loading model', trainedModelFile);

    // tslint:disable-next-line:no-var-requires
    const trainedJsonData: fr.FaceDescriptor[] = require(trainedModelFilePath);

    recognizer.load(trainedJsonData);

    console.log('imported the following descriptors:');
    console.log(recognizer.getDescriptorState());
}

const bbtThemeImgs = fs.readdirSync(dataPath)
    .filter((f) => f.includes('bbt'))
    .map((f) => path.join(dataPath, f))
    .map((fp) => fr.loadImage(fp));

bbtThemeImgs.forEach((_img, i) => {
    let img = _img;

    // resize image if too small
    const minPxSize = 400000;
    if ((img.cols * img.rows) < minPxSize) {
        img = fr.resizeImage(img, minPxSize / (img.cols * img.rows));
    }

    console.log('detecting faces for query image');
    const faceRects = detector.locateFaces(img).map((res) => res.rect);
    const faces = detector.getFacesFromLocations(img, faceRects, 150);

    const win = new fr.ImageWindow();
    win.setImage(img);
    drawRects(win, faceRects);

    // mark faces with distance > 0.6 as unknown
    const unknownThreshold = 0.6;
    faceRects.forEach((rect, r) => {
        const prediction = recognizer.predictBest(faces[r], unknownThreshold);
        win.addOverlay(rect, `${prediction.className} (${prediction.distance})`);
        console.log(rect);
        console.log(prediction);
    });
});
fr.hitEnterToContinue();
