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

const recognizer = fr.AsyncFaceRecognizer();

const allFiles = fs.readdirSync(dataPath);
const imagesByClass = classNames.map((c) =>
    allFiles
        .filter((f) => f.includes(c))
        .map((f) => path.join(dataPath, f))
        .map((fp) => fr.loadImage(fp))
);

const trainDataByClass = imagesByClass.map((imgs) => imgs.slice(0, numTrainFaces));
const testDataByClass = imagesByClass.map((imgs) => imgs.slice(numTrainFaces));

function runClassification() {
    const errors = classNames.map((_) => 0);
    Promise.all(
        testDataByClass.map(
            (faces, label) =>
                Promise.all(faces.map(
                    (face, i) => recognizer.predictBest(face)
                        .then((prediction) => {
                            // count number of wrong classifications
                            if (prediction.className !== classNames[label]) {
                                errors[label] = errors[label] + 1;
                            }
                        })
                )
                )
        )
    )
        .then(() => {
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
        });
}

if (!fs.existsSync(trainedModelFilePath)) {
    console.log('%s not found, start training recognizer...', trainedModelFile);

    // schedule a thread for each class
    Promise.all(
        trainDataByClass.map((faces, label) => {
            const name = classNames[label];
            return recognizer.addFaces(faces, name);
        })
    )
        .then(() => {
            fs.writeFileSync(trainedModelFilePath, JSON.stringify(recognizer.serialize()));
        })
        .then(() => {
            runClassification();
        });
} else {
    console.log('found %s, loading model', trainedModelFile);

    // tslint:disable-next-line:no-var-requires
    const trainedJsonData: fr.FaceDescriptor[] = require(trainedModelFilePath);

    recognizer.load(trainedJsonData);

    console.log('imported the following descriptors:');
    console.log(recognizer.getDescriptorState());

    runClassification();
}
