face-recognition.js
=============

Simple Node.js API for robust face detection and face recognition. This a Node.js wrapper library for the face detection and face recognition tools implemented in <a href="https://github.com/davisking/dlib"><b>dlib</b></a>.

## Examples

### Face Detection

![face-got](https://user-images.githubusercontent.com/31125521/34471083-636f939a-ef3f-11e7-91e0-f4308abb8011.jpg)
![faces](https://user-images.githubusercontent.com/31125521/34500565-9670989e-f00b-11e7-8c2d-012aa72b2de1.jpg)

### Face Landmarks

![landmark5](https://user-images.githubusercontent.com/31125521/34471086-63a74358-ef3f-11e7-9fe8-641bc8a3a2dd.jpg)
![landmark68](https://user-images.githubusercontent.com/31125521/34471087-63c3118c-ef3f-11e7-9e7c-a741bef3f4b2.jpg)


### Face Recognition
![facerec](https://user-images.githubusercontent.com/31125521/34644195-fca4a3b6-f331-11e7-85c9-04adc9c4e413.jpg)

## Install

### Requirements
- cmake
- windows users will need VS2017 build tools (not Visual Studio 2017) -> https://www.visualstudio.com/de/downloads/

### Auto build
Installing the package will build dlib for you and download the models. Note, this might take some time.
``` bash
npm install face-recognition
```

### Manual build
If you want to use an own build of <a href="https://github.com/davisking/dlib"><b>dlib</b></a>:
- set DLIB_INCLUDE_DIR to the source directory of dlib
- set DLIB_LIB_DIR to the file path to dlib.lib | dlib.so | dlib.dylib

If you set these environment variables, the package will use your own build instead of compiling dlib:
``` bash
npm install face-recognition
```

## How to use

``` javascript
const fr = require('face-recognition')
```

### Loading images from disk

``` javascript
const image1 = fr.loadImage('path/to/image1.png')
const image2 = fr.loadImage('path/to/image2.jpg')
```

### Displaying Images

``` javascript
const win = new fr.ImageWindow()

// display image
win.setImage(image)

// drawing the rectangle into the displayed image
win.addOverlay(rectangle)

// pause program until key pressed
fr.hitEnterToContinue()
```


### Face Detection

``` javascript
const detector = fr.FaceDetector()
```

Detect all faces in the image and return the bounding rectangles:
``` javascript
const faceRectangles = detector.locateFaces(image)
```

Detect all faces and return them as seperate images:
``` javascript
const faceImages = detector.detectFaces(image)
```

You can also specify the output size of the face images (default is 150 e.g. 150x150):
``` javascript
const targetSize = 200
const faceImages = detector.detectFaces(image, targetSize)
```

### Face Recognition

``` javascript
const recognizer = fr.FaceRecognizer()
```

Train the recognizer with face images of atleast two different persons:

``` javascript
// arrays of face images, (use FaceDetector to detect and extract faces)
const sheldonFaces = [ ... ]
const rajFaces = [ ... ]
const howardFaces = [ ... ]

recognizer.addFaces(sheldonFaces, 'sheldon')
recognizer.addFaces(rajFaces, 'raj')
recognizer.addFaces(howardFaces, 'howard')
```

You can also jitter the training data, which will apply transformations such as rotation, scaling and mirroring to create different versions of each input face. Increasing the number of jittered version may increase prediction accuracy but also increases training time:
``` javascript
const numJitters = 15
recognizer.addFaces(sheldonFaces, 'sheldon', numJitters)
recognizer.addFaces(rajFaces, 'raj', numJitters)
recognizer.addFaces(howardFaces, 'howard', numJitters)
```

Get the distances to each class:

``` javascript
const predictions = recognizer.predict(sheldonFaceImage)
console.log(predictions)
```

example output (the lower the distance, the higher the similarity):
``` javascript
[
  {
    className: 'sheldon',
    distance: 0.5
  },
  {
    className: 'raj',
    distance: 0.8
  },
  {
    className: 'howard',
    distance: 0.7
  }
]
```

Or immediately get the best result:

``` javascript
const bestPrediction = recognizer.predict(sheldonFaceImage)
console.log(bestPrediction)
```

example output:
``` javascript
{
  className: 'sheldon',
  distance: 0.5
}
```

Save a trained model to json file:
``` javascript
const fs = require('fs')
const modelState = recognizer.serialize()
fs.writeFileSync('model.json', JSON.stringify(modelState))
```

Load a trained model from json file:
``` javascript
const modelState = require('model.json')
recognizer.load(modelState)
```

### Face Landmarks

This time using the FrontalFaceDetector (you can also use FaceDetector):
``` javascript
const detector = new fr.FrontalFaceDetector()
```

Use 5 point landmarks predictor:
``` javascript
const predictor = fr.FaceLandmark5Predictor()
```

Or 68 point landmarks predictor:
``` javascript
const predictor = fr.FaceLandmark68Predictor()
```

First get the bounding rectangles of the faces:
``` javascript
const img = fr.loadImage('image.png')
const faceRects = detector.detect(img)
```

Find the face landmarks:
``` javascript
const shapes = faceRects.map(rect => predictor.predict(img, rect))
```

Display the face landmarks:
``` javascript
const win = new fr.ImageWindow()
win.setImage(img)
win.renderFaceDetections(shapes)
fr.hitEnterToContinue()
```
