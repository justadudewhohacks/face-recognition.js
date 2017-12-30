#include "facedetection.h"
#include "FrontalFaceDetector.h"
#include "FaceDetectorNet.h"

NAN_MODULE_INIT(FaceDetection::Init) {
	FrontalFaceDetector::Init(target);
	FaceDetectorNet::Init(target);
};