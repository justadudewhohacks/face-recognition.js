#include "ShapePredictor.h"
#include "ImageRGB.h"
#include "Rect.h"
#include "FullObjectDetection.h"

Nan::Persistent<v8::FunctionTemplate> ShapePredictor::constructor;

NAN_MODULE_INIT(ShapePredictor::Init) {
	v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(ShapePredictor::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("ShapePredictor").ToLocalChecked());

	Nan::SetPrototypeMethod(ctor, "predict", Predict);

	target->Set(Nan::New("ShapePredictor").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(ShapePredictor::New) {
	std::string modelPath;
	FF_TRY_UNWRAP_ARGS(
		"ShapePredictor::New",
		StringConverter::arg(0, &modelPath, info)
	);
	ShapePredictor* self = new ShapePredictor();
	dlib::deserialize(modelPath) >> self->predictor;
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};

NAN_METHOD(ShapePredictor::Predict) {
	dlib::matrix<dlib::rgb_pixel> img;
	dlib::rectangle rect;
	FF_TRY_UNWRAP_ARGS(
		"ShapePredictor::Detect",
		ImageRGB::Converter::arg(0, &img, info)
		|| Rect::Converter::arg(1, &rect, info)
	);

	dlib::shape_predictor predictor = ShapePredictor::Converter::unwrap(info.This());
	dlib::full_object_detection shape = predictor(img, rect);
	info.GetReturnValue().Set(FullObjectDetection::Converter::wrap(shape));
};

