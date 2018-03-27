#include "Converters.h"
#include "dlib/geometry/vector.h"

#ifndef __FACEREC_POINT_H__
#define __FACEREC_POINT_H__

class Point : public Nan::ObjectWrap {
public:
	dlib::point pt;

	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(New);

	static NAN_GETTER(GetX) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).x());
	}
	static NAN_GETTER(GetY) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).y());
	}
	static NAN_GETTER(GetZ) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).z());
	}

	static Nan::Persistent<v8::FunctionTemplate> constructor;

	dlib::point* getNativeObjectPtr() { return &pt; }
	dlib::point getNativeObject() { return pt; }

	typedef InstanceConverter<Point, dlib::point> Converter;

	static const char* getClassName() {
		return "Point";
	}
};

#endif