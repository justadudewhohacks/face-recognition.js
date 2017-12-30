#include "facedetection.h"
#include "FrontalFaceDetector.h"

NAN_MODULE_INIT(FaceDetection::Init) {
	FrontalFaceDetector::Init(target);
};