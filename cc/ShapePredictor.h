#include "Converters.h"
#include <dlib/image_processing.h>

#ifndef __FACEREC_SHAPEPREDICTOR_H__
#define __FACEREC_SHAPEPREDICTOR_H__

class ShapePredictor : public Nan::ObjectWrap {
public:
	dlib::shape_predictor predictor;

	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(New);

	struct PredictWorker;
	static NAN_METHOD(Predict);
	static NAN_METHOD(PredictAsync);

	static Nan::Persistent<v8::FunctionTemplate> constructor;

	dlib::shape_predictor* getNativeObjectPtr() { return &predictor; }
	dlib::shape_predictor getNativeObject() { return predictor; }

	typedef InstanceConverter<ShapePredictor, dlib::shape_predictor> Converter;

	static const char* getClassName() {
		return "ShapePredictor";
	}
};

#endif