#include "Converters.h"
#include "dlib/matrix.h"
#include "dlib/image_transforms.h"
#include "ImageGray.h"

#ifndef __FACEREC_IMAGERGB_H__
#define __FACEREC_IMAGERGB_H__

class ImageRGB : public Nan::ObjectWrap {
public:
	dlib::matrix<dlib::rgb_pixel> img;

	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(New);
	static NAN_METHOD(ToGray);

	static NAN_GETTER(GetCols) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).nc());
	}
	static NAN_GETTER(GetRows) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).nr());
	}

	static Nan::Persistent<v8::FunctionTemplate> constructor;

	dlib::matrix<dlib::rgb_pixel>* getNativeObjectPtr() { return &img; }
	dlib::matrix<dlib::rgb_pixel> getNativeObject() { return img; }

	typedef InstanceConverter<ImageRGB, dlib::matrix<dlib::rgb_pixel>> Converter;

	static const char* getClassName() {
		return "ImageRGB";
	}
};

#endif