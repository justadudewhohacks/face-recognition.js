#include "Converters.h"
#include "dlib/geometry/rectangle.h"

#ifndef __FACEREC_RECT_H__
#define __FACEREC_RECT_H__

class Rect : public Nan::ObjectWrap {
public:
	dlib::rectangle rect;

	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(New);

	static NAN_GETTER(GetLeft) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).left());
	}
	static NAN_GETTER(GetRight) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).right());
	}
	static NAN_GETTER(GetTop) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).top());
	}
	static NAN_GETTER(GetBottom) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).bottom());
	}
	static NAN_GETTER(GetArea) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).area());
	}

	static Nan::Persistent<v8::FunctionTemplate> constructor;

	dlib::rectangle* getNativeObjectPtr() { return &rect; }
	dlib::rectangle getNativeObject() { return rect; }

	typedef InstanceConverter<Rect, dlib::rectangle> Converter;

	static const char* getClassName() {
		return "Rect";
	}
};

#endif