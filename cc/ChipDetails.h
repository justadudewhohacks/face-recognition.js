#include "Converters.h"
#include "dlib/image_transforms.h"
#include "Rect.h"

#ifndef __FACEREC_CHIPDETAILS_H__
#define __FACEREC_CHIPDETAILS_H__

class ChipDetails : public Nan::ObjectWrap {
public:
	dlib::chip_details details;

	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(New);

	static NAN_GETTER(GetRect) {
		info.GetReturnValue().Set(Rect::Converter::wrap((dlib::rectangle)Converter::unwrap(info.This()).rect));
	}
	static NAN_GETTER(GetCols) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).cols);
	}
	static NAN_GETTER(GetRows) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).rows);
	}
	static NAN_GETTER(GetAngle) {
		info.GetReturnValue().Set((double)Converter::unwrap(info.This()).angle);
	}
	static NAN_GETTER(GetSize) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).size());
	}

	static Nan::Persistent<v8::FunctionTemplate> constructor;

	dlib::chip_details* getNativeObjectPtr() { return &details; }
	dlib::chip_details getNativeObject() { return details; }

	typedef InstanceConverter<ChipDetails, dlib::chip_details> Converter;

	static const char* getClassName() {
		return "ChipDetails";
	}
};

#endif