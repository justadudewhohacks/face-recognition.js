#include "FaceDetectorNet.h"
#include "MmodRect.h"

Nan::Persistent<v8::FunctionTemplate> FaceDetectorNet::constructor;

NAN_MODULE_INIT(FaceDetectorNet::Init) {
  v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(FaceDetectorNet::New);
  constructor.Reset(ctor);
  ctor->InstanceTemplate()->SetInternalFieldCount(1);
  ctor->SetClassName(Nan::New("FaceDetectorNet").ToLocalChecked());

	Nan::SetPrototypeMethod(ctor, "detect", Detect);
	Nan::SetPrototypeMethod(ctor, "detectAsync", DetectAsync);

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
struct FaceDetectorNet::DetectWorker : public SimpleWorker {
public:
	net_type net;

	DetectWorker(net_type self) {
		this->net = self;
	}

	dlib::matrix<PT> img; 
	std::vector<dlib::mmod_rect> rects;

	const char* execute() {
		dlib::matrix<dlib::rgb_pixel> rgbImg;
		dlib::assign_image(rgbImg, img);
		rects = net(rgbImg);
		return "";
	}

	v8::Local<v8::Value> getReturnValue() {
		return ObjectArrayConverter<MmodRect, dlib::mmod_rect>::wrap(rects);
	}

	bool unwrapRequiredArgs(Nan::NAN_METHOD_ARGS_TYPE info) {
		return (
			CT::Converter::arg(0, &img, info)
		);
	}
};

NAN_METHOD(FaceDetectorNet::Detect) {
	if (CvImage::Converter::hasInstance(info[0])) {
		DetectWorkerBGR worker(FaceDetectorNet::Converter::unwrap(info.This()));
		FF_WORKER_SYNC("FaceDetectorNet::Detect", worker);
		info.GetReturnValue().Set(worker.getReturnValue());
	}
	else {
		DetectWorkerRGB worker(FaceDetectorNet::Converter::unwrap(info.This()));
		FF_WORKER_SYNC("FaceDetectorNet::Detect", worker);
		info.GetReturnValue().Set(worker.getReturnValue());
	}
}

NAN_METHOD(FaceDetectorNet::DetectAsync) {
	if (CvImage::Converter::hasInstance(info[0])) {
		DetectWorkerBGR worker(FaceDetectorNet::Converter::unwrap(info.This()));
		FF_WORKER_ASYNC("FaceDetectorNet::DetectAsync", DetectWorkerBGR, worker);
	}
	else {
		DetectWorkerRGB worker(FaceDetectorNet::Converter::unwrap(info.This()));
		FF_WORKER_ASYNC("FaceDetectorNet::DetectAsync", DetectWorkerRGB, worker);
	}
}
