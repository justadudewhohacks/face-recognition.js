#include "converters/Converters.h"
#include "dlib/image_io.h"
#include "dlib/image_transforms.h"

#ifndef __DFACEJS_UTILS_H__
#define __DFACEJS_UTILS_H__

class Utils : public Nan::ObjectWrap {
public:
	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(Load_Image);
	static NAN_METHOD(PyramidUp);
	static NAN_METHOD(ResizeImage);
	static NAN_METHOD(HitEnterToContinue);
	static NAN_METHOD(GetFaceChipDetails);
	static NAN_METHOD(ExtractImageChips);
	static NAN_METHOD(TileImages);
};

#endif