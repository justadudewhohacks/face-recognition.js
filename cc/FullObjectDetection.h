#include "Converters.h"
#include "dlib/image_processing/full_object_detection.h"
#include "Rect.h"

#ifndef __FACEREC_FULLOBJECTDETECTION_H__
#define __FACEREC_FULLOBJECTDETECTION_H__

class FullObjectDetection : public Nan::ObjectWrap {
public:
	dlib::full_object_detection detection;

	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(New);
	static NAN_METHOD(GetParts);

	static NAN_GETTER(GetRect) {
		info.GetReturnValue().Set(Rect::Converter::wrap(Converter::unwrap(info.This()).get_rect()));
	}
	static NAN_GETTER(GetNumParts) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).num_parts());
	}

	static Nan::Persistent<v8::FunctionTemplate> constructor;

	dlib::full_object_detection* getNativeObjectPtr() { return &detection; }
	dlib::full_object_detection getNativeObject() { return detection; }

	typedef InstanceConverter<FullObjectDetection, dlib::full_object_detection> Converter;

	static const char* getClassName() {
		return "FullObjectDetection";
	}
};

#endif