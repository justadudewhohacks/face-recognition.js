#include "Converters.h"
#include "dlib/image_processing/full_object_detection.h"
#include "Rect.h"

#ifndef __FACEREC_MMODRECT_H__
#define __FACEREC_MMODRECT_H__

class MmodRect : public Nan::ObjectWrap {
public:
	dlib::mmod_rect rect;

	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(New);

	static NAN_GETTER(GetRect) {
		info.GetReturnValue().Set(Rect::Converter::wrap(Converter::unwrap(info.This()).rect));
	}
	static NAN_GETTER(GetConfidence) {
		info.GetReturnValue().Set((double)Converter::unwrap(info.This()).detection_confidence);
	}

	static Nan::Persistent<v8::FunctionTemplate> constructor;

	dlib::mmod_rect* getNativeObjectPtr() { return &rect; }
	dlib::mmod_rect getNativeObject() { return rect; }

	typedef InstanceConverter<MmodRect, dlib::mmod_rect> Converter;

	static const char* getClassName() {
		return "MmodRect";
	}
};

#endif