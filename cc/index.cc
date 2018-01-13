#include <nan.h>
#include "utils.h"
#include "ImageRGB.h"
#include "ImageGray.h"
#include "CvImage.h"
#include "Rect.h"
#include "MmodRect.h"
#include "FullObjectDetection.h"
#include "Point.h"
#include "Array.h"
#include "ChipDetails.h"
#include "ImageWindow.h"
#include "ShapePredictor.h"
#include "FrontalFaceDetector.h"
#include "FaceDetectorNet.h"
#include "FaceRecognizerNet.h"

NAN_MODULE_INIT(InitModule) {
	ImageRGB::Init(target);
	ImageGray::Init(target);
	CvImage::Init(target);
	Rect::Init(target);
	MmodRect::Init(target);
	FullObjectDetection::Init(target);
	Point::Init(target);
	Array::Init(target);
	ChipDetails::Init(target);
	Utils::Init(target);
	ImageWindow::Init(target);
	ShapePredictor::Init(target);
	FrontalFaceDetector::Init(target);
	FaceDetectorNet::Init(target);
	FaceRecognizerNet::Init(target);
}

NODE_MODULE(facerec, InitModule);