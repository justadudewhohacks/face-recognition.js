#include <nan.h>
#include "ImageRGB.h"
#include "ImageGray.h"
#include "Rect.h"
#include "MmodRect.h"
#include "FullObjectDetection.h"
#include "Point.h"
#include "utils.h"
#include "ImageWindow.h"
#include "facedetection.h"

NAN_MODULE_INIT(InitModule) {
	ImageRGB::Init(target);
	ImageGray::Init(target);
	Rect::Init(target);
	MmodRect::Init(target);
	FullObjectDetection::Init(target);
	Point::Init(target);
	Utils::Init(target);
	FaceDetection::Init(target);
	ImageWindow::Init(target);
}

NODE_MODULE(dfacejs, InitModule);