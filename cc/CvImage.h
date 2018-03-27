#include "Converters.h"
#include "GenericImage.h"

#ifndef __FACEREC_CVIMAGE_H__
#define __FACEREC_CVIMAGE_H__

class CvImage : public Nan::ObjectWrap {
public:
	GenericImage<dlib::bgr_pixel> img;
	CvImage() {
	}

	CvImage(dlib::matrix<dlib::bgr_pixel> img) {
		this->img = GenericImage<dlib::bgr_pixel>(img);
	}

	CvImage(int rows, int cols, int widthStep, int elemSize, const char* data) {
		this->img = GenericImage<dlib::bgr_pixel>(rows, cols, widthStep, elemSize, data);
	}

	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(New);

	static NAN_GETTER(GetCols) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).nc());
	}
	static NAN_GETTER(GetRows) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).nr());
	}

	static Nan::Persistent<v8::FunctionTemplate> constructor;

	dlib::matrix<dlib::bgr_pixel>* getNativeObjectPtr() { return img.getImagePtr(); }
	dlib::matrix<dlib::bgr_pixel> getNativeObject() { return img.getImage(); }

	typedef InstanceConverter<CvImage, dlib::matrix<dlib::bgr_pixel>> Converter;

	static const char* getClassName() {
		return "CvImage";
	}
};

#endif