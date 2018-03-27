#include "Converters.h"
#include "dlib/matrix.h"

#ifndef __FACEREC_IMAGEGRAY_H__
#define __FACEREC_IMAGEGRAY_H__

class ImageGray : public Nan::ObjectWrap {
public:
	dlib::matrix<unsigned char> img;

	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(New);

	static NAN_GETTER(GetCols) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).nc());
	}
	static NAN_GETTER(GetRows) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).nr());
	}


	static Nan::Persistent<v8::FunctionTemplate> constructor;

	dlib::matrix<unsigned char>* getNativeObjectPtr() { return &img; }
	dlib::matrix<unsigned char> getNativeObject() { return img; }

	typedef InstanceConverter<ImageGray, dlib::matrix<unsigned char>> Converter;

	static const char* getClassName() {
		return "ImageGray";
	}
};

#endif