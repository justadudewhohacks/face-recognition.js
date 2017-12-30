#include "FrontalFaceDetector.h"
#include "ImageRGB.h"
#include "Rect.h"

Nan::Persistent<v8::FunctionTemplate> FrontalFaceDetector::constructor;

NAN_MODULE_INIT(FrontalFaceDetector::Init) {
  v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(FrontalFaceDetector::New);
  constructor.Reset(ctor);
  ctor->InstanceTemplate()->SetInternalFieldCount(1);
  ctor->SetClassName(Nan::New("FrontalFaceDetector").ToLocalChecked());

	Nan::SetPrototypeMethod(ctor, "detect", Detect);

  target->Set(Nan::New("FrontalFaceDetector").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(FrontalFaceDetector::New) {
	FrontalFaceDetector* self = new FrontalFaceDetector();
  self->detector = dlib::get_frontal_face_detector();
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};

NAN_METHOD(FrontalFaceDetector::Detect) {
	dlib::matrix<dlib::rgb_pixel> img;
	double adjustThreshold;
	FF_TRY_UNWRAP_ARGS(
		"FrontalFaceDetector::Detect",
		ImageRGB::Converter::arg(0, &img, info)
		|| DoubleConverter::optArg(1, &adjustThreshold, info)
	);

	dlib::frontal_face_detector detector = FrontalFaceDetector::Converter::unwrap(info.This());
	std::vector<dlib::rectangle> rects = detector(img, adjustThreshold);

	info.GetReturnValue().Set(ObjectArrayConverter<Rect, dlib::rectangle>::wrap(rects));
};

