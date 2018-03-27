#include "Converters.h"
#include "dlib/matrix.h"

#ifndef __FACEREC_ARRAY_H__
#define __FACEREC_ARRAY_H__

class Array : public Nan::ObjectWrap {
public:
	dlib::matrix<double> arr;

	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(New);
	static NAN_METHOD(GetData);

	static NAN_GETTER(GetLength) {
		info.GetReturnValue().Set((int)Converter::unwrap(info.This()).size());
	}

	static Nan::Persistent<v8::FunctionTemplate> constructor;

	dlib::matrix<double>* getNativeObjectPtr() { return &arr; }
	dlib::matrix<double> getNativeObject() { return arr; }

	typedef InstanceConverter<Array, dlib::matrix<double>> Converter;

	static const char* getClassName() {
		return "Array";
	}

	static std::vector<double> toVec(dlib::matrix<double> arr) {
		return std::vector<double>(arr.begin(), arr.end());
	}

	static dlib::matrix<double> fromVec(std::vector<double> vec) {
		return dlib::mat(vec);
	}
};

#endif