#include "ImageWindow.h"
#include "ImageRGB.h"
#include "ImageGray.h"
#include "CvImage.h"
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
	Nan::SetPrototypeMethod(ctor, "close", Close);

  target->Set(Nan::New("ImageWindow").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(ImageWindow::New) {
	ImageWindow* self = new ImageWindow();
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};

template<class PT, class CT>
void ImageWindow::setImage(Nan::NAN_METHOD_ARGS_TYPE info) {
	dlib::matrix<PT> img;
	FF_TRY_UNWRAP_ARGS(
		"ImageWindow::SetImage",
		CT::Converter::arg(0, &img, info)
	);

	Nan::ObjectWrap::Unwrap<ImageWindow>(info.This())->win.set_image(img);
};

NAN_METHOD(ImageWindow::SetImage) {
	if (ImageGray::Converter::hasInstance(info[0])) {
		setImage<unsigned char, ImageGray>(info);
	}
	else if (ImageRGB::Converter::hasInstance(info[0])) {
		setImage<dlib::rgb_pixel, ImageRGB>(info);
	}
	else if (CvImage::Converter::hasInstance(info[0])) {
		setImage<dlib::bgr_pixel, CvImage>(info);
	}
};

NAN_METHOD(ImageWindow::SetSize) {
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
	std::string label = "";
	FF_TRY_UNWRAP_ARGS(
		"ImageWindow::SetImage",
		Rect::Converter::arg(0, &rect, info)
		|| StringConverter::optArg(1, &label, info)
	); 
	Nan::ObjectWrap::Unwrap<ImageWindow>(info.This())->win.add_overlay(dlib::image_window::overlay_rect(rect, dlib::rgb_pixel(0, 0, 255), label));
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

NAN_METHOD(ImageWindow::Close) {
	Nan::ObjectWrap::Unwrap<ImageWindow>(info.This())->win.close_window();
};
