#include "FaceRecognizerNet.h"
#include "ImageRGB.h"
#include "CvImage.h"
#include "MmodRect.h"
#include "Array.h"

Nan::Persistent<v8::FunctionTemplate> FaceRecognizerNet::constructor;

NAN_MODULE_INIT(FaceRecognizerNet::Init) {
	v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(FaceRecognizerNet::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("FaceRecognizerNet").ToLocalChecked());

	Nan::SetPrototypeMethod(ctor, "computeFaceDescriptor", ComputeFaceDescriptor);

	target->Set(Nan::New("FaceRecognizerNet").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(FaceRecognizerNet::New) {
	std::string modelPath;
	FF_TRY_UNWRAP_ARGS(
		"FaceRecognizerNet::New",
		StringConverter::arg(0, &modelPath, info)
	);
	FaceRecognizerNet* self = new FaceRecognizerNet();
	dlib::deserialize(modelPath) >> self->net;
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};

template<class PT, class CT>
void FaceRecognizerNet::computeFaceDescriptor(Nan::NAN_METHOD_ARGS_TYPE info) {
	dlib::matrix<PT> face;
	FF_TRY_UNWRAP_ARGS(
		"FaceRecognizerNet::ComputeFaceDescriptor",
		CT::Converter::arg(0, &face, info)
	);

	anet_type net = FaceRecognizerNet::Converter::unwrap(info.This());

	dlib::matrix<dlib::rgb_pixel> rgbFace;
	dlib::assign_image(rgbFace, face);
	dlib::matrix<double> descriptor = dlib::matrix_cast<double>(net(std::vector<dlib::matrix<dlib::rgb_pixel>>(1, rgbFace)).at(0));
	info.GetReturnValue().Set(Array::Converter::wrap(descriptor));
};

NAN_METHOD(FaceRecognizerNet::ComputeFaceDescriptor) {
	if (CvImage::Converter::hasInstance(info[0])) {
		computeFaceDescriptor<dlib::bgr_pixel, CvImage>(info);
	}
	else {
		computeFaceDescriptor<dlib::rgb_pixel, ImageRGB>(info);
	}
};
