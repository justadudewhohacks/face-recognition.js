#include "FaceRecognizerNet.h"
#include "MmodRect.h"
#include "Array.h"

Nan::Persistent<v8::FunctionTemplate> FaceRecognizerNet::constructor;

NAN_MODULE_INIT(FaceRecognizerNet::Init) {
	v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(FaceRecognizerNet::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("FaceRecognizerNet").ToLocalChecked());

	Nan::SetPrototypeMethod(ctor, "computeFaceDescriptor", ComputeFaceDescriptor);
	Nan::SetPrototypeMethod(ctor, "computeFaceDescriptorAsync", ComputeFaceDescriptorAsync);

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
struct FaceRecognizerNet::ComputeFaceDescriptorWorker : public SimpleWorker {
public:
	anet_type net;

	ComputeFaceDescriptorWorker(anet_type self) {
		this->net = self;
	}

	dlib::matrix<PT> face;
	dlib::matrix<double> descriptor;

	const char* execute() {
		dlib::matrix<dlib::rgb_pixel> rgbFace;
		dlib::assign_image(rgbFace, face);
		descriptor = dlib::matrix_cast<double>(net(std::vector<dlib::matrix<dlib::rgb_pixel>>(1, rgbFace)).at(0));
		return "";
	}

	v8::Local<v8::Value> getReturnValue() {
		return Array::Converter::wrap(descriptor);
	}

	bool unwrapRequiredArgs(Nan::NAN_METHOD_ARGS_TYPE info) {
		return (
			CT::Converter::arg(0, &face, info)
		);
	}
};

NAN_METHOD(FaceRecognizerNet::ComputeFaceDescriptor) {
	if (CvImage::Converter::hasInstance(info[0])) {
		ComputeFaceDescriptorWorkerBGR worker(FaceRecognizerNet::Converter::unwrap(info.This()));
		FF_WORKER_SYNC("FaceRecognizerNet::ComputeFaceDescriptor", worker);
		info.GetReturnValue().Set(worker.getReturnValue());
	}
	else {
		ComputeFaceDescriptorWorkerRGB worker(FaceRecognizerNet::Converter::unwrap(info.This()));
		FF_WORKER_SYNC("FaceRecognizerNet::ComputeFaceDescriptor", worker);
		info.GetReturnValue().Set(worker.getReturnValue());
	}
}

NAN_METHOD(FaceRecognizerNet::ComputeFaceDescriptorAsync) {
	if (CvImage::Converter::hasInstance(info[0])) {
		ComputeFaceDescriptorWorkerBGR worker(FaceRecognizerNet::Converter::unwrap(info.This()));
		FF_WORKER_ASYNC("FaceRecognizerNet::ComputeFaceDescriptorAsync", ComputeFaceDescriptorWorkerBGR, worker);
	}
	else {
		ComputeFaceDescriptorWorkerRGB worker(FaceRecognizerNet::Converter::unwrap(info.This()));
		FF_WORKER_ASYNC("FaceRecognizerNet::ComputeFaceDescriptorAsync", ComputeFaceDescriptorWorkerRGB, worker);
	}
}