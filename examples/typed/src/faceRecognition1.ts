import * as fs from 'fs';
import * as path from 'path';
import fr = require('../../../');
import { getAppdataPath, ensureAppdataDirExists } from './commons';

fr.winKillProcessOnExit();

ensureAppdataDirExists();

const numTrainFaces = 5;
const trainedModelFile = `faceRecognition1Model_t${numTrainFaces}_150.json`;
const trainedModelFilePath = path.resolve(getAppdataPath(), trainedModelFile);

const dataPath = path.resolve('../../data/faces');
const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart'];

const recognizer = fr.FaceRecognizer();

const allFiles = fs.readdirSync(dataPath);
const imagesByClass = classNames.map((c) =>
    allFiles
        .filter((f) => f.includes(c))
        .map((f) => path.join(dataPath, f))
        .map((fp) => fr.loadImage(fp))
);

const trainDataByClass = imagesByClass.map((imgs) => imgs.slice(0, numTrainFaces));
const testDataByClass = imagesByClass.map((imgs) => imgs.slice(numTrainFaces));

if (!fs.existsSync(trainedModelFilePath)) {
    console.log('%s not found, start training recognizer...', trainedModelFile);

    trainDataByClass.forEach((faces, label) => {
        const name = classNames[label];
        recognizer.addFaces(faces, name);
    });

    fs.writeFileSync(trainedModelFilePath, JSON.stringify(recognizer.serialize()));
} else {
    console.log('found %s, loading model', trainedModelFile);

    // tslint:disable-next-line:no-var-requires
    const trainedJsonData: fr.FaceDescriptor[] = require(trainedModelFilePath);

    recognizer.load(trainedJsonData);

    console.log('imported the following descriptors:');
    console.log(recognizer.getDescriptorState());
}

const errors = classNames.map((_) => 0);
testDataByClass.forEach((faces, label) => {
    const name = classNames[label];
    console.log();
    console.log('testing %s', name);
    faces.forEach((face, i) => {
        const prediction = recognizer.predictBest(face);
        console.log('%s (%s)', prediction.className, prediction.distance);

        // count number of wrong classifications
        if (prediction.className !== name) {
            errors[label] = errors[label] + 1;
        }
    });
});

// print the result
const result = classNames.map((className, label) => {
    const numTestFaces = testDataByClass[label].length;
    const numCorrect = numTestFaces - errors[label];
    const accuracy = ((numCorrect / numTestFaces) * 10000) / 100;
    // tslint:disable-next-line:max-line-length
    return `${className} ( ${accuracy}% ) : ${numCorrect} of ${numTestFaces} faces have been recognized correctly`;
});
console.log('result:');
console.log(result);
