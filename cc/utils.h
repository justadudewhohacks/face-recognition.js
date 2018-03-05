#include "Converters.h"
#include "dlib/image_io.h"
#include "dlib/image_transforms.h"

#ifndef __FACEREC_UTILS_H__
#define __FACEREC_UTILS_H__

class Utils : public Nan::ObjectWrap {
public:
	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(Load_Image);
	static NAN_METHOD(Save_Image);

	template<class PT, class CT> 
	static void pyramidUp(Nan::NAN_METHOD_ARGS_TYPE info);
	static NAN_METHOD(PyramidUp);

	template<class PT, class CT> 
	static void resizeImage(Nan::NAN_METHOD_ARGS_TYPE info);
	static NAN_METHOD(ResizeImage);

	static NAN_METHOD(CvImageToImageRGB);
	static NAN_METHOD(HitEnterToContinue);
	static NAN_METHOD(GetFaceChipDetails);
	static NAN_METHOD(ExtractImageChips);
	static NAN_METHOD(TileImages);
	static NAN_METHOD(JitterImage);
	static NAN_METHOD(Mean);
	static NAN_METHOD(Distance);
};

#endif