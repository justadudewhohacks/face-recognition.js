#include "FaceDetectorNet.h"
#include "ImageRGB.h"
#include "CvImage.h"
#include "MmodRect.h"

Nan::Persistent<v8::FunctionTemplate> FaceDetectorNet::constructor;

NAN_MODULE_INIT(FaceDetectorNet::Init) {
  v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(FaceDetectorNet::New);
  constructor.Reset(ctor);
  ctor->InstanceTemplate()->SetInternalFieldCount(1);
  ctor->SetClassName(Nan::New("FaceDetectorNet").ToLocalChecked());

	Nan::SetPrototypeMethod(ctor, "detect", Detect);

  target->Set(Nan::New("FaceDetectorNet").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(FaceDetectorNet::New) {
	std::string modelPath;
	FF_TRY_UNWRAP_ARGS(
		"FaceDetectorNet::New",
		StringConverter::arg(0, &modelPath, info)
	);
	FaceDetectorNet* self = new FaceDetectorNet();
	dlib::deserialize(modelPath) >> self->net;
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};

template<class PT, class CT>
void FaceDetectorNet::detect(Nan::NAN_METHOD_ARGS_TYPE info) {
	dlib::matrix<PT> img;
	FF_TRY_UNWRAP_ARGS(
		"FaceDetectorNet::Detect",
		CT::Converter::arg(0, &img, info)
	);
	net_type net = FaceDetectorNet::Converter::unwrap(info.This());

	dlib::matrix<dlib::rgb_pixel> rgbImg;
	dlib::assign_image(rgbImg, img);
	std::vector<dlib::mmod_rect> rects = net(rgbImg);

	info.GetReturnValue().Set(ObjectArrayConverter<MmodRect, dlib::mmod_rect>::wrap(rects));
};

NAN_METHOD(FaceDetectorNet::Detect) {
	if (CvImage::Converter::hasInstance(info[0])) {
		detect<dlib::bgr_pixel, CvImage>(info);
	}
	else {
		detect<dlib::rgb_pixel, ImageRGB>(info);
	}
};
