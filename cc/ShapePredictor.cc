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
	Nan::SetPrototypeMethod(ctor, "predictAsync", PredictAsync);

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

struct ShapePredictor::PredictWorker : public SimpleWorker {
public:
	dlib::shape_predictor predictor;

	PredictWorker(dlib::shape_predictor self) {
		this->predictor = self;
	}

	dlib::matrix<dlib::rgb_pixel> img;
	dlib::rectangle rect;

	dlib::full_object_detection shape;

	const char* execute() {
		shape = predictor(img, rect);
		return "";
	}

	v8::Local<v8::Value> getReturnValue() {
		return FullObjectDetection::Converter::wrap(shape);
	}

	bool unwrapRequiredArgs(Nan::NAN_METHOD_ARGS_TYPE info) {
		return (
			ImageRGB::Converter::arg(0, &img, info)
			|| Rect::Converter::arg(1, &rect, info)
		);
	}
};

NAN_METHOD(ShapePredictor::Predict) {
	PredictWorker worker(ShapePredictor::Converter::unwrap(info.This()));
	FF_WORKER_SYNC("ShapePredictor::Predict", worker);
	info.GetReturnValue().Set(worker.getReturnValue());
}

NAN_METHOD(ShapePredictor::PredictAsync) {
	PredictWorker worker(ShapePredictor::Converter::unwrap(info.This()));
	FF_WORKER_ASYNC("ShapePredictor::PredictAsync", PredictWorker, worker);
}