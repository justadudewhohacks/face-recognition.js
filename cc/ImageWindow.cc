#include "ImageWindow.h"
#include "ImageRGB.h"
#include "ImageGray.h"
#include "Rect.h"
#include "FullObjectDetection.h"

Nan::Persistent<v8::FunctionTemplate> ImageWindow::constructor;

NAN_MODULE_INIT(ImageWindow::Init) {
  v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(ImageWindow::New);
  constructor.Reset(ctor);
  ctor->InstanceTemplate()->SetInternalFieldCount(1);
  ctor->SetClassName(Nan::New("ImageWindow").ToLocalChecked());

	Nan::SetPrototypeMethod(ctor, "setImage", SetImage);
	Nan::SetPrototypeMethod(ctor, "setSize", SetSize);
	Nan::SetPrototypeMethod(ctor, "clearOverlay", ClearOverlay); 
	Nan::SetPrototypeMethod(ctor, "addOverlay", AddOverlay);
	Nan::SetPrototypeMethod(ctor, "renderFaceDetections", RenderFaceDetections);

  target->Set(Nan::New("ImageWindow").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(ImageWindow::New) {
	ImageWindow* self = new ImageWindow();
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};

NAN_METHOD(ImageWindow::SetImage) {
	bool isGray = ImageGray::Converter::hasInstance(info[0]);

	dlib::matrix<unsigned char> imgGray;
	dlib::matrix<dlib::rgb_pixel> img;
	FF_TRY_UNWRAP_ARGS(
		"ImageWindow::SetImage",
		(isGray && ImageGray::Converter::arg(0, &imgGray, info))
		|| ImageRGB::Converter::arg(0, &img, info)
	);

	if (isGray) {
		Nan::ObjectWrap::Unwrap<ImageWindow>(info.This())->win.set_image(imgGray);
	}
	else {
		Nan::ObjectWrap::Unwrap<ImageWindow>(info.This())->win.set_image(img);
	}
};

NAN_METHOD(ImageWindow::SetSize) {
	bool isGray = ImageGray::Converter::hasInstance(info[0]);

	int width, height;
	FF_TRY_UNWRAP_ARGS(
		"ImageWindow::SetSize",
		IntConverter::arg(0, &width, info)
		|| IntConverter::arg(1, &height, info)
	);
	Nan::ObjectWrap::Unwrap<ImageWindow>(info.This())->win.set_size(width, height);
};

NAN_METHOD(ImageWindow::ClearOverlay) {
	Nan::ObjectWrap::Unwrap<ImageWindow>(info.This())->win.clear_overlay();
};

NAN_METHOD(ImageWindow::AddOverlay) {
	dlib::rectangle rect;
	FF_TRY_UNWRAP_ARGS(
		"ImageWindow::SetImage",
		Rect::Converter::arg(0, &rect, info)
	);
	Nan::ObjectWrap::Unwrap<ImageWindow>(info.This())->win.add_overlay(rect);
};

NAN_METHOD(ImageWindow::RenderFaceDetections) {
	std::vector<dlib::full_object_detection> detections;
	bool didThrow = ObjectArrayConverter<FullObjectDetection, dlib::full_object_detection>::arg(0, &detections, info);
	FF_TRY_UNWRAP_ARGS(
		"ImageWindow::RenderFaceDetections", 
		didThrow
	);
	Nan::ObjectWrap::Unwrap<ImageWindow>(info.This())->win.add_overlay(dlib::render_face_detections(detections));
};