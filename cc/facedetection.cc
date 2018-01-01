#include "facedetection.h"
#include "FrontalFaceDetector.h"
#include "FaceDetectorNet.h"
#include "ShapePredictor.h"

NAN_MODULE_INIT(FaceDetection::Init) {
	FrontalFaceDetector::Init(target);
	FaceDetectorNet::Init(target);
	ShapePredictor::Init(target);
};